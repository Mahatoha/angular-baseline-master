import { InjectionToken } from "@angular/core";

import { AuthModuleConfig } from "./_internal/auth-module-config.model";

export const AUTH_MODULE_CONFIG: InjectionToken<AuthModuleConfig> = new InjectionToken("authModuleConfig");
