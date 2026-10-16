import { InjectionToken } from "@angular/core";

export type ParamsHumanizerFn = (paramValue: string) => string;
export interface ParamsHumanizer {
    readonly humanizerMap: Map<string, ParamsHumanizerFn>;
}

export const PARAMS_HUMANIZER: InjectionToken<ParamsHumanizer> = new InjectionToken("paramsHumanizer");
