import { InjectionToken } from "@angular/core";

import { AuthConfig as Oauth2AuthConfig } from "angular-oauth2-oidc";

export const APP_CONFIG: InjectionToken<AppConfig> = new InjectionToken<AppConfig>("applicationConfiguration");

export interface AppConfig {
    appTitle: string;
    baseUrls: BaseUrlsConfig;
    environment: string;
    version: string;
    authConfig: AuthConfig;
}

export interface BaseUrlsConfig {
    gestionActeApi: string;
}

export type AuthConfig = Oauth2AuthConfig & {
    oauthInterceptorRegex: string;
};
