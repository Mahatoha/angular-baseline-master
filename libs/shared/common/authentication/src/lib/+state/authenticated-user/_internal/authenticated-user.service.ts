import { inject, InjectionToken, Service } from "@angular/core";

import { AuthenticatedUserStore } from "./authenticated-user.store";
import { AuthenticatedUser } from "../../../models";

interface CanLog {
    log: (msg: unknown, ...args: Array<unknown>) => void;
}
export const LOGGER: InjectionToken<CanLog> = new InjectionToken("canLogUser");

@Service({ autoProvided: false })
export class UserService {
    private readonly store: AuthenticatedUserStore = inject(AuthenticatedUserStore);
    private readonly logger: CanLog | null = inject(LOGGER, { optional: true });

    public setUser(user: AuthenticatedUser): void {
        this.logUser(user);
        this.store.update(user);
    }

    private logUser(user: AuthenticatedUser): void {
        const loggedUser: [string, AuthenticatedUser] = ["Authenticated User : ", user];
        if (this.logger != null) {
            this.logger.log(loggedUser);
        } else {
            // eslint-disable-next-line no-console
            console.log(loggedUser);
        }
    }
}
