import { MonoTypeOperatorFunction, defer } from "rxjs";
import { finalize } from "rxjs/operators";

export function notifyState<T>(handler: (isRunning: boolean) => void): MonoTypeOperatorFunction<T> {
    return (source) =>
        defer(() => {
            handler(true);
            return source.pipe(finalize(() => handler(false)));
        });
}
