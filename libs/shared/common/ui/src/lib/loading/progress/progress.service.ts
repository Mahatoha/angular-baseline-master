/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Service } from "@angular/core";

import { Observable, Subject, OperatorFunction, concat, of, BehaviorSubject } from "rxjs";
import { switchMap, map, delay, shareReplay, distinctUntilChanged } from "rxjs/operators";

import { ProgressState, ProgressPercent } from "./models";
import { LongRunningOptions, ease, longRunning } from "./progress.utils";

@Service()
export class ProgressService {
    private static readonly raz: Observable<ProgressState> = of({
        current: 0,
        total: 0,
    });
    public progress$: Observable<number>;
    public requestCount$: Observable<number>;

    private readonly registerSubject: Subject<Observable<ProgressState>> = new BehaviorSubject(ProgressService.raz);

    constructor() {
        const progressState$: Observable<ProgressState> = this.registerSubject.pipe(
            switchMap((x) => concat(x, ProgressService.raz.pipe(delay(1500)))),
            shareReplay(1)
        );

        this.progress$ = progressState$.pipe(
            map((x) => this.stateToPercent(x)),
            ease(),
            shareReplay(1)
        );

        this.requestCount$ = progressState$.pipe(
            map(({ total: count }) => count),
            distinctUntilChanged(),
            shareReplay(1)
        );
    }

    public longRunning<T>(options: Partial<LongRunningOptions> = {}): OperatorFunction<Observable<T>, T> {
        return (source) =>
            source.pipe(
                longRunning({
                    ...options,
                    progressHandler: (x) => this.handle(x),
                })
            );
    }

    public handle(state$: Observable<ProgressState>): void {
        this.registerSubject.next(state$);
    }

    private stateToPercent(state: ProgressState): ProgressPercent {
        if (state.total === 0) {
            return { current: 0, next: 0 };
        } else {
            return {
                current: (state.current * 100) / state.total,
                next: Math.min(((state.current + 1) * 100) / state.total, 100),
            };
        }
    }
}
