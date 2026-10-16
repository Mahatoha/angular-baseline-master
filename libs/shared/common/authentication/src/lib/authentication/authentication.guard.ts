import { Location } from "@angular/common";
import { inject, Service } from "@angular/core";
import { Router, UrlTree } from "@angular/router";

import { Observable, catchError, of } from "rxjs";

import { ERROR_LOGIN_ROUTE, LOGIN_ROUTE } from "../models";
import { AuthenticationService } from "./_internal/authentication.service";

@Service({ autoProvided: false })
export class AuthenticationGuard {
    private readonly authService: AuthenticationService = inject(AuthenticationService);
    private readonly router: Router = inject(Router);
    private readonly location: Location = inject(Location);

    public canActivate(): Observable<boolean | UrlTree> {
        const loginUrl: string = `${LOGIN_ROUTE}?redirectUri=${this.location.path()}`;

        if (this.authService.isLogged()) {
            return this.authService.trySetUser().pipe(catchError(() => of(this.router.parseUrl(ERROR_LOGIN_ROUTE))));
        } else {
            return of(this.router.parseUrl(loginUrl));
        }
    }
}
