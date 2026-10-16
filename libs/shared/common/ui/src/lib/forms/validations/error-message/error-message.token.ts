import { InjectionToken } from "@angular/core";

import { GA_ERROR_MESSAGES } from "./error-message.const";
import { GestionActeErrorMessages } from "../gestion-acte-validators.model";

export const ERROR_MESSAGES: InjectionToken<GestionActeErrorMessages> = new InjectionToken("Error messages", {
    providedIn: "root",
    factory: () => GA_ERROR_MESSAGES,
});
