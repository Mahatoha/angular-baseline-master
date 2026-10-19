import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { ERROR_LOGIN_ROUTE, LOGOUT_ROUTE } from "../../models";
import { AuthenticationService } from "../_internal/authentication.service";

@Component({
    selector: "abm-login",
    templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit {
    private readonly authenticationService: AuthenticationService = inject(AuthenticationService);
    private readonly router: Router = inject(Router);
    private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

    public ngOnInit(): void {
        if (!this.authenticationService.isLogged()) {
            this.initAuthentication();
        } else if (
            // When connecting to the application or opening the application in a new tab while already connected, the Login component may be instanciated twice :
            // - the first time it performs it's job then redirect to the requested path and is destroyed
            // - if, on the requested path, there is at least one resolver returning an observable or a promise that does not complete immediatly, the Login component is instanciated a second time and,
            //   as the user is already logged in, navigates to the empty path while the resolver is still running.
            // When the second instance of Login navigates, the resolver and the navigation to the requested path is canceled and the user is redirected to the home page with his context lost.
            // To prevent this, the navigation during Login component init is bypassed when a navigation is already in progress, for an already logged in user.
            // If the user navigate directly to the Login component using it's url, no navigation should be in progress so he will be redirected to the empty path.
            this.router.currentNavigation() === null
        ) {
            this.router.navigate([""]);
        }
    }

    private initAuthentication(): void {
        const redirectUri: string = this.activatedRoute.snapshot.queryParams["redirectUri"] ?? "";

        this.authenticationService.tryLogin().subscribe({
            next: (isLoggedOrRedirectUri: false | string) => {
                if (isLoggedOrRedirectUri === false) {
                    this.authenticationService.initLoginFlow(redirectUri);
                } else {
                    this.router.navigateByUrl(this.normalizeRedirectUri(isLoggedOrRedirectUri));
                }
            },
            error: () => {
                this.router.navigate([ERROR_LOGIN_ROUTE]);
            },
        });
    }

    private normalizeRedirectUri(redirectUri: string): string {
        if (redirectUri === LOGOUT_ROUTE) {
            return "";
        }
        return redirectUri;
    }
}
