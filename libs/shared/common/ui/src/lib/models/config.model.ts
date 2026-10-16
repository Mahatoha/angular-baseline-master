import { Observable } from "rxjs";

export interface IConfig<T> {
    configuration: T;
    configuration$: Observable<T>;
}
