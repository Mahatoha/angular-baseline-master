import { Injector, inject, Service } from "@angular/core";
import { Router, UrlTree } from "@angular/router";

import { filterUndefined } from "@gestion-acte/rxjs-operators";
import { concat, defer, of } from "rxjs";
import { Observable } from "rxjs/internal/Observable";

import { AuthorizedUserQuery } from "./+state";
import { AuthorizedUserService } from "./+state/_internal/authorized-user.service";
import { AuthorizedUser } from "./models";

@Service({ autoProvided: false })
export class AuthorizationGuard {
    private readonly authorizedUserQuery: AuthorizedUserQuery<AuthorizedUser> = inject(AuthorizedUserQuery);
    private readonly router: Router = inject(Router);
    private readonly injector: Injector = inject(Injector);

    public canActivate(): Observable<boolean | UrlTree> {
        /**
         *  As the USER_DATA injection token cannot be provided at build guard time we have to manually inject it to delay
         *  our usage at canActivate runtime.
         */
        const authorizedUserService: AuthorizedUserService = this.injector.get(AuthorizedUserService);
        return concat(
            authorizedUserService.fetchAuthorizedUser(),
            defer(() => of(this.isAuthorized()))
        ).pipe(filterUndefined());
    }

    private isAuthorized(): boolean | UrlTree {
        return this.authorizedUserQuery.isAuthorized() || this.router.parseUrl("unauthorized");
    }
}
