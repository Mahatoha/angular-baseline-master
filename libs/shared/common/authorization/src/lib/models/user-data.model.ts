import { InjectionToken } from "@angular/core";

import { Observable } from "rxjs";

import { AuthorizedUser } from "./authorized-user.model";

export interface GetAuthorizedUser {
    getAuthorizedUser: () => Observable<AuthorizedUser>;
}
export const USER_DATA: InjectionToken<GetAuthorizedUser> = new InjectionToken("getAuthorizedUser");
