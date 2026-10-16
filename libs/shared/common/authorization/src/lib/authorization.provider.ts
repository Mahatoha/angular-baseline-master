import { EnvironmentProviders, makeEnvironmentProviders } from "@angular/core";
import { ROUTES } from "@angular/router";

import { AuthorizedUserQuery } from "./+state";
import { AuthorizedUserService } from "./+state/_internal/authorized-user.service";
import { AuthorizedUserStore } from "./+state/_internal/authorized-user.store";
import { AuthorizationGuard } from "./authorization.guard";
import { authorizationRoutes } from "./authorization.routes";

export function provideAuthorization(): EnvironmentProviders {
    return makeEnvironmentProviders([
        {
            provide: ROUTES,
            multi: true,
            useValue: authorizationRoutes,
        },
        AuthorizedUserStore,
        AuthorizedUserQuery,
        AuthorizedUserService,
        AuthorizationGuard,
    ]);
}
