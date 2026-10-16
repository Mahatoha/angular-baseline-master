import { OnDestroy, Service } from "@angular/core";

import { notifyState } from "@gestion-acte/rxjs-operators";
import { Observable, Subject, ReplaySubject, GroupedObservable, MonoTypeOperatorFunction } from "rxjs";
import { filter, startWith, groupBy, switchMap, shareReplay, takeUntil, delay } from "rxjs/operators";

@Service()
export class ActionStateService implements OnDestroy {
    private readonly actionStateSubject: Subject<ActionState> = new Subject();
    private readonly stateByAction$: Observable<GroupedObservable<string, boolean>>;
    private readonly disposeSignal: Subject<void> = new Subject();

    constructor() {
        this.stateByAction$ = this.actionStateSubject.pipe(
            groupBy<ActionState, string, boolean>(
                (x) => this.getGroupKey(x.actionKey, x.entityId),
                (x) => x.isRunning,
                (x) =>
                    x.pipe(
                        // tap((y) =>
                        //     logger.log(`New value for group '${x.key}' : ${y}`)
                        // ),
                        filter((y) => !y),
                        delay(1)
                        // finalize(() => logger.log(`Group '${x.key}' deleted`))
                    ),
                () => new ReplaySubject(1)
            ),
            shareReplay(1),
            takeUntil(this.disposeSignal)
        );
        this.stateByAction$.subscribe();
    }

    public ngOnDestroy(): void {
        this.disposeSignal.next();
        this.disposeSignal.complete();
    }

    public change(isRunning: boolean, actionKey: string, entityId?: string | number): void {
        // logger.log("change: ", actionKey, entityId, isRunning);
        this.actionStateSubject.next({
            actionKey,
            entityId,
            isRunning,
        });
    }

    public onChange(actionKey: string, entityId?: string | number): Observable<boolean> {
        const groupKey: string = this.getGroupKey(actionKey, entityId);
        return this.stateByAction$.pipe(
            filter((x) => x.key.startsWith(groupKey)),
            switchMap((x) => x),
            startWith(false)
            // tap((x) => logger.log("onChange: ", actionKey, entityId, x))
        );
    }

    public notifyState<T>(key: string, id?: string | number): MonoTypeOperatorFunction<T> {
        return (source) => source.pipe(notifyState((x) => this.change(x, key, id)));
    }

    private getGroupKey(actionKey: string, entityId?: string | number): string {
        if (entityId === undefined) {
            return `[${actionKey}]`;
        } else {
            return `[${actionKey}][${entityId}]`;
        }
    }
}
interface ActionState {
    actionKey: string;
    entityId?: string | number;
    isRunning: boolean;
}
