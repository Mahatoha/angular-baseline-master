import { AuthConfig } from "angular-oauth2-oidc";

export interface AuthModuleConfig {
    authConfig: AuthConfig;
    interceptorRegex: string;
}
