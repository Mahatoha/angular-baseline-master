import { Service } from "@angular/core";

import { Store, StoreConfig } from "@datorama/akita";

import { AuthenticatedUser } from "../../../models";

@Service({ autoProvided: false })
@StoreConfig({ name: "authenticatedUser", resettable: true })
export class AuthenticatedUserStore extends Store<AuthenticatedUser> {
    constructor() {
        super({});
    }
}
