import { TypedForm } from "./form-model";

export type FormModel<T> = { [P in keyof T]-?: T[P] | null };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface FormUtils<T = unknown, TAnnotations extends Record<string, any> | null = null> {
    formDefaultValues: T;
    buildForm(): TypedForm<T, TAnnotations>;
}
