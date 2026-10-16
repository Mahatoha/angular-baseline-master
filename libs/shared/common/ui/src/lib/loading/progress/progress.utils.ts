/* eslint-disable @typescript-eslint/no-magic-numbers */
import { OperatorFunction, Observable, of, interval, Subject, ReplaySubject } from "rxjs";
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
    switchMap,
    take,
} from "rxjs/operators";

import { ProgressPercent } from "./models";

export function ease(duration: number = 5000, period: number = 500): OperatorFunction<ProgressPercent, number> {
    const steps: number = duration / period;
    return (source) => {
        return source.pipe(switchMap((x) => getEasedValues(x.current, x.next, steps, period)));
    };
}

function getEasedValues(from: number, to: number, steps: number, period: number): Observable<number> {
    if (from === to) {
        return of(from);
    }

    return interval(period).pipe(
        take(steps + 1),
        map((x) => computeEasedValue(from, to, steps, x))
    );
}

export function computeEasedValue(from: number, to: number, steps: number, currentStep: number): number {
    const outExpoResult: number = outExpo(currentStep / steps) * 0.9;
    return from + outExpoResult * (to - from);
}

// Crédits ts-easing package https://github.com/streamich/ts-easing ,
function outExpo(t: number): number {
    return -Math.pow(2, -10 * t) + 1;
}

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
