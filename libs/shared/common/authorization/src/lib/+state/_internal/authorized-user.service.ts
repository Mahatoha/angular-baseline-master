import { inject, Service } from "@angular/core";

import { switchMapSignal } from "@gestion-acte/rxjs-operators";
import { Observable } from "rxjs";

import { AuthorizedUserStore } from "./authorized-user.store";
import { AuthorizedUser, GetAuthorizedUser, USER_DATA } from "../../models";

@Service({ autoProvided: false })
export class AuthorizedUserService {
    private readonly store: AuthorizedUserStore<AuthorizedUser> = inject(AuthorizedUserStore);
    private readonly userDataService: GetAuthorizedUser = inject(USER_DATA);

    public fetchAuthorizedUser(): Observable<never> {
        return this.userDataService.getAuthorizedUser().pipe(
            switchMapSignal((x) => {
                this.store.update(x);
            })
        );
    }
}
