import { OperatorFunction, of } from "rxjs";
import { ignoreElements, switchMap } from "rxjs/operators";

export function switchMapSignal<T>(signal: (value: T, index: number) => unknown): OperatorFunction<T, never> {
    return (source) =>
        source.pipe(
            switchMap((value, index) => of(signal(value, index))),
            ignoreElements()
        );
}
