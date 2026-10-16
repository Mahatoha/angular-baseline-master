import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { EnvironmentProviders, makeEnvironmentProviders } from "@angular/core";
import { ROUTES } from "@angular/router";

import { AUTH_CONFIG, provideOAuthClient } from "angular-oauth2-oidc";

import { AuthenticatedUserQuery } from "./+state/authenticated-user";
import { UserService } from "./+state/authenticated-user/_internal/authenticated-user.service";
import { AuthenticatedUserStore } from "./+state/authenticated-user/_internal/authenticated-user.store";
import { OAuthInterceptor } from "./authentication/_internal/authentication.interceptor";
import { AuthenticationGuard } from "./authentication/authentication.guard";
import { authenticationRoutes } from "./authentication.routes";
import { AUTH_MODULE_CONFIG, OAUTH_INTERCEPTOR_URL_REGEX } from "./models";
import { AuthModuleConfig } from "./models/_internal/auth-module-config.model";

export function provideAuthentication(): EnvironmentProviders {
    return makeEnvironmentProviders([
        {
            provide: ROUTES,
            multi: true,
            useValue: authenticationRoutes,
        },
        AuthenticatedUserStore,
        AuthenticatedUserQuery,
        UserService,
        provideOAuthClient(),
        { provide: HTTP_INTERCEPTORS, useClass: OAuthInterceptor, multi: true },
        {
            provide: OAUTH_INTERCEPTOR_URL_REGEX,
            useFactory: (authModuleConfig: AuthModuleConfig) => authModuleConfig.interceptorRegex,
            deps: [AUTH_MODULE_CONFIG],
        },
        {
            provide: AUTH_CONFIG,
            useFactory: (authModuleConfig: AuthModuleConfig) => authModuleConfig.authConfig,
            deps: [AUTH_MODULE_CONFIG],
        },
        AuthenticationGuard,
    ]);
}
