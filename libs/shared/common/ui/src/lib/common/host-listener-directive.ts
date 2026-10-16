import { Directive, ElementRef, InputSignal, OnDestroy, OnInit, inject, input } from "@angular/core";

import { Subject, filter, fromEvent, ignoreElements, map, takeUntil } from "rxjs";

/**
 * Directive de base qui se substitue au décorateur '@HostListener'
 * d'Angular.
 *
 * Offre la possibilité de dynamiser les évènements écoutés à
 * travers les classes enfantes, qui détermineront également les
 * callbacks de trigger et d'unset.
 */
@Directive()
export abstract class HostListenerDirective implements OnInit, OnDestroy {
    /**
     * Permet de stopper l'écoute des évènements ainsi
     * que l'exécution des callbacks afférents.
     */
    public disabledSnl: InputSignal<boolean> = input(false, { alias: "disabled" });

    private readonly disposeSignal$ = new Subject<void>();

    protected readonly elementRef: ElementRef = inject(ElementRef);

    /**
     * L'évènement sur lequel doit s'exécuter le callback de trigger
     * lorsqu'il est émis.
     *
     * Doit être déterminé dans les implémentations concrètes de la classe.
     */
    protected abstract triggerEvent: "mouseenter" | "click";

    /**
     * L'évènement sur lequel doit s'exécuter le callback d'unset
     * lorsqu'il est émis.
     *
     * Doit être déterminé dans les implémentations concrètes de la classe.
     */
    protected abstract unsetEvent: "mouseleave";

    /**
     * Méthode qui s'exécute lorsque l'évènement [triggerEvent]{@link HostListenerDirective#triggerEvent} est déclenché.
     *
     * Doit être déterminé dans les implémentations concrètes de la classe.
     */
    protected abstract triggerHandler(): unknown;

    /**
     * Méthode qui s'exécute lorsque l'évènement [unsetEvent]{@link HostListenerDirective#unsetEvent} est déclenché.
     *
     * Doit être déterminé dans les implémentations concrètes de la classe.
     */
    protected abstract unsetHandler(): unknown;

    public ngOnInit(): void {
        this.listenForTrigger();
        this.listenForUnset();
    }

    public ngOnDestroy(): void {
        this.disposeSignal$.next();
        this.disposeSignal$.complete();
    }

    private listenForTrigger(): void {
        fromEvent(this.elementRef.nativeElement, this.triggerEvent)
            .pipe(
                filter(() => !this.disabledSnl()),
                map(() => this.triggerHandler()),
                ignoreElements(),
                takeUntil(this.disposeSignal$)
            )
            .subscribe();
    }

    private listenForUnset(): void {
        fromEvent(this.elementRef.nativeElement, this.unsetEvent)
            .pipe(
                map(() => this.unsetHandler()),
                ignoreElements(),
                takeUntil(this.disposeSignal$)
            )
            .subscribe();
    }
}
