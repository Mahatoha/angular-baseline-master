import { InjectionToken } from "@angular/core";

export interface ReferentialHumanizer<T> {
    humanizeReferential(code: string, type: T): string | undefined;
}

export const REFERENTIAL_HUMANIZER: InjectionToken<ReferentialHumanizer<unknown>> = new InjectionToken(
    "referentialHumanizer"
);
