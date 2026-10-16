import { inject, Service } from "@angular/core";

import { AbstractQuery } from "@gestion-acte/utils";

import { AuthenticatedUserStore } from "./_internal/authenticated-user.store";
import { AuthenticatedUser } from "../../models";

@Service({ autoProvided: false })
export class AuthenticatedUserQuery extends AbstractQuery<AuthenticatedUser> {
    constructor() {
        super(inject(AuthenticatedUserStore));
    }

    public getAuthenticatedUser(): AuthenticatedUser {
        return this.query.getValue();
    }

    public isAuthenticated(): boolean {
        const user: AuthenticatedUser | undefined = this.getAuthenticatedUser();

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        return user.iat !== undefined;
    }
}
