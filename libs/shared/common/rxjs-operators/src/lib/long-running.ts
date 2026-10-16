import { Observable, OperatorFunction, of, Subject, ReplaySubject } from "rxjs";
import {
    scan,
    mergeAll,
    map,
    shareReplay,
    catchError,
    tap,
    toArray,
    concatAll,
    finalize,
    delay,
    filter,
} from "rxjs/operators";

export interface LongRunningProgressState {
    current: number;
    total: number;
    isOk: boolean;
}

export type LongRunningProgressHandlerFunction = (progress$: Observable<LongRunningProgressState>) => void;

export interface LongRunningOptions {
    progressHandler: LongRunningProgressHandlerFunction;
    parallel: boolean;
    concurrent: number;
    continueOnError: boolean;
    // TODO : errorHandler + globalErrorHandler
    // TODO : key for job cancellation/replacement
}

interface LongRunningChildError {
    longRunningChildErrorObject: unknown;
}

function instanceOfLongRunningChildError(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    object: any
): object is LongRunningChildError {
    return typeof object === "object" && "longRunningChildErrorObject" in object;
}

export function longRunning<T>(
    options: ((progress: LongRunningProgressState) => void) | Partial<LongRunningOptions> = {}
): OperatorFunction<Observable<T>, T> {
    const effectiveOptions: LongRunningOptions = {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        progressHandler: () => {},
        parallel: false,
        concurrent: 1,
        continueOnError: false,
        ...(typeof options === "function" ? { progressHandler: (x) => x.subscribe(options) } : options),
    };

    return (source) => {
        let total: number = 0;

        const stepSubject: Subject<boolean> = new ReplaySubject();
        const state$: Observable<LongRunningProgressState> = stepSubject.pipe(
            scan(
                (state, step) => ({
                    current: step ? state.current + 1 : state.current,
                    total,
                    isOk: step,
                }),
                {
                    current: -1,
                    total: 0,
                    isOk: true,
                }
            ),
            shareReplay()
        );

        effectiveOptions.progressHandler(state$);

        return source
            .pipe(
                toArray(),
                tap((x) => (total = x.length)),
                tap(() => stepSubject.next(true)),
                concatAll()
            )
            .pipe(
                map((x) =>
                    x.pipe(
                        delay(0),
                        map((y) => of(y).pipe(delay(0))),
                        concatAll(),
                        catchError((err) =>
                            of<LongRunningChildError>({
                                longRunningChildErrorObject: err,
                            })
                        ),
                        tap({
                            error: () => stepSubject.next(true),
                            complete: () => stepSubject.next(true),
                        })
                    )
                ),
                // TODO : multiple job sequences
                mergeAll(effectiveOptions.parallel ? effectiveOptions.concurrent : 1)
            )
            .pipe(
                filter((x) => !effectiveOptions.continueOnError || !instanceOfLongRunningChildError(x)),
                map((x) => {
                    if (instanceOfLongRunningChildError(x)) {
                        stepSubject.next(false);
                        throw x.longRunningChildErrorObject;
                    }

                    return x;
                }),
                finalize(() => stepSubject.complete())
            );
    };
}
