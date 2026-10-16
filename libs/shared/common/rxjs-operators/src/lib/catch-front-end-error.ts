import { MonoTypeOperatorFunction } from "rxjs";
import { catchError } from "rxjs/operators";

export class HandledError extends Error {
    constructor(public error: Error) {
        super();
    }
}

export function catchFrontEndError<T>(handle: (err: unknown) => void): MonoTypeOperatorFunction<T> {
    return (source) =>
        source.pipe(
            catchError((err) => {
                if (err instanceof HandledError) {
                    throw err;
                } else {
                    handle(err);
                    throw new HandledError(err);
                }
            })
        );
}
