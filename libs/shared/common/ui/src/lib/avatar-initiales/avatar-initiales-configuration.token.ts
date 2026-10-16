import { InjectionToken } from "@angular/core";

import { Observable } from "rxjs";

export interface AvatarConfig {
    lastName: string;
    firstName: string;
    action?: () => void;
    backgroundColor?: string;
    color?: string;
}

export interface AvatarInitialesConfiguration {
    mainAvatarAction?: () => void;
    extraAvatars$?: Observable<Array<AvatarConfig>>;
    backgroundColor?: string;
    color?: string;
}

export const AVATAR_CONFIG: InjectionToken<Observable<AvatarInitialesConfiguration>> = new InjectionToken(
    "avatarInitialesConfiguration"
);
