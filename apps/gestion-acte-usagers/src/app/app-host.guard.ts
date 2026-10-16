import { inject, Service } from "@angular/core";
import { UrlTree } from "@angular/router";

import { AuthenticatedUserQuery, AuthenticationGuard } from "@gestion-acte/authentication";
import { AuthorizationGuard, AuthorizedUser, AuthorizedUserQuery } from "@gestion-acte/authorization";
import { ModuleLoadedService } from "@gestion-acte/bootstrap";
import { Observable, of, switchMap } from "rxjs";

@Service()
export class AppHostGuard {
    private readonly authenticationGuard: AuthenticationGuard = inject(AuthenticationGuard);
    private readonly authorizationGuard: AuthorizationGuard = inject(AuthorizationGuard);
    private readonly moduleLoadedService: ModuleLoadedService = inject(ModuleLoadedService);
    private readonly authenticatedUserQuery: AuthenticatedUserQuery = inject(AuthenticatedUserQuery);
    private readonly authorizedUserQuery: AuthorizedUserQuery<AuthorizedUser> = inject(AuthorizedUserQuery);

    public canMatch(): Observable<boolean | UrlTree> {
        const isCoreLoaded: boolean = this.moduleLoadedService.isModuleLoaded("CoreModule");
        return this.isAuthenticatedGuard().pipe(
            switchMap((isAuthenticatedOrRedirectUri) => {
                if (isAuthenticatedOrRedirectUri === true) {
                    return this.isAuthorizedGuard(isCoreLoaded);
                } else {
                    return of(isAuthenticatedOrRedirectUri);
                }
            })
        );
    }

    private isAuthenticatedGuard(): Observable<boolean | UrlTree> {
        const isAuthenticated: boolean = this.authenticatedUserQuery.isAuthenticated();

        if (isAuthenticated) {
            return of(true);
        }

        return this.authenticationGuard.canActivate();
    }

    private isAuthorizedGuard(isCoreLoaded: boolean): Observable<boolean | UrlTree> {
        const isCurrentUserAuthorized: boolean = this.authorizedUserQuery.isAuthorized();

        if (isCoreLoaded && isCurrentUserAuthorized) {
            return of(true);
        }

        return this.authorizationGuard.canActivate();
    }
}
