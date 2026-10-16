import { Type } from "@angular/core";

export interface GeneratedComponent<T = unknown> {
    uuid: string;
    component: Type<T>;
    order?: number;
    inputs?: Record<keyof T, unknown> | null;
}
