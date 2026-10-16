import { registerLocaleData } from "@angular/common";
import { provideHttpClient, withInterceptorsFromDi, withXhr } from "@angular/common/http";
import localeFr from "@angular/common/locales/fr";
import {
    ApplicationConfig,
    inject,
    LOCALE_ID,
    NgZone,
    provideBrowserGlobalErrorListeners,
    provideEnvironmentInitializer,
    provideZoneChangeDetection,
} from "@angular/core";
import { provideRouter, withComponentInputBinding, withRouterConfig } from "@angular/router";

import { akitaDevtools } from "@datorama/akita";
import { AUTH_MODULE_CONFIG, provideAuthentication } from "@gestion-acte/authentication";
import { provideAuthorization, USER_DATA } from "@gestion-acte/authorization";
import { ENVIRONMENT } from "@gestion-acte/configuration";
import { provideOptimus } from "@openng/optimus-ui/config";
import { GestionActesApiConfiguration, GestionActesApiConfigurationParams } from "@shared/apis/gestion-actes";
import { APP_CONFIG, AppConfig } from "@shared/usagers/configuration";
import { of } from "rxjs";

import { appRoutes } from "./app.routes";
import appTheme from "./app.theme";
import { environment } from "../environments/environment";

registerLocaleData(localeFr, "fr-FR");

export function buildApplicationConfig(appConfig: AppConfig): ApplicationConfig {
    return {
        providers: [
            { provide: LOCALE_ID, useValue: "fr-FR" },
            { provide: ENVIRONMENT, useValue: environment },
            { provide: APP_CONFIG, useValue: appConfig },
            provideBrowserGlobalErrorListeners(),
            provideZoneChangeDetection({ eventCoalescing: true }),
            provideHttpClient(withXhr(), withInterceptorsFromDi()),
            provideOptimus({
                theme: {
                    preset: appTheme,
                    options: {
                        darkModeSelector: false,
                    },
                },
            }),
            provideEnvironmentInitializer(() => {
                if (!environment.production) {
                    akitaDevtools(inject(NgZone));
                }
            }),
            {
                provide: AUTH_MODULE_CONFIG,
                useFactory: (config: AppConfig) => ({
                    authConfig: config.authConfig,
                    interceptorRegex: config.authConfig.oauthInterceptorRegex,
                }),
                deps: [APP_CONFIG],
            },
            {
                // TODO /!\ TEMPORARY /!\ use real data service when available
                provide: USER_DATA,
                useFactory: () => {
                    return {
                        getAuthorizedUser: () => {
                            // eslint-disable-next-line no-console
                            console.log("FAKE AUTHORIZE");
                            return of({ id: 123, name: "Username" });
                        },
                    };
                },
            },
            provideAuthentication(),
            provideAuthorization(),
            provideRouter(
                appRoutes,
                withComponentInputBinding(),
                withRouterConfig({ paramsInheritanceStrategy: "always" })
            ),
            {
                provide: GestionActesApiConfiguration,
                useFactory: (config: AppConfig): GestionActesApiConfigurationParams => ({
                    rootUrl: config.baseUrls.gestionActeApi,
                }),
                deps: [APP_CONFIG],
            },
        ],
    };
}
