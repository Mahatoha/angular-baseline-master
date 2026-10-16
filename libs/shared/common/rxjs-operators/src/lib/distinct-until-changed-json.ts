import { MonoTypeOperatorFunction } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

export function distinctUntilChangedJson<T>(): MonoTypeOperatorFunction<T> {
    return (source) => source.pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)));
}
