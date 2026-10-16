import { Service } from "@angular/core";

import { Store, StoreConfig } from "@datorama/akita";

import { AuthorizedUser } from "../../models";

@Service()
@StoreConfig({ name: "authorizedUser", resettable: true })
export class AuthorizedUserStore<T extends AuthorizedUser | null> extends Store<T> {
    // TODO: Checker que lorsqu'on extends la query le store n'est pas créer 2 fois
    constructor() {
        super({});
    }
}
