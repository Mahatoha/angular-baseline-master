import { inject, Service } from "@angular/core";

import { AbstractQuery } from "@gestion-acte/utils";

import { AuthorizedUser } from "../models";
import { AuthorizedUserStore } from "./_internal/authorized-user.store";

@Service()
export class AuthorizedUserQuery<T extends AuthorizedUser | null> extends AbstractQuery<T> {
    constructor() {
        super(inject(AuthorizedUserStore));
    }

    public get(): AuthorizedUser {
        const authorizedUser: AuthorizedUser | null = this.getCurrent();
        if (authorizedUser !== null) {
            return authorizedUser;
        } else {
            throw new Error("Vous n’êtes pas autorisé(e) à accéder à cette application.");
        }
    }

    public isAuthorized(): boolean {
        return this.getCurrent() !== null;
    }

    private isEmpty(user: AuthorizedUser | null): boolean {
        return user === null || (typeof user === "object" && Object.keys(user).length === 0);
    }

    private getCurrent(): AuthorizedUser | null {
        const authorizedUser: AuthorizedUser | null = this.query.getValue();
        if (!this.isEmpty(authorizedUser)) {
            return authorizedUser;
        }
        return null;
    }
}
