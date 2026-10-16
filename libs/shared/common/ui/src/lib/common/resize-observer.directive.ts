import { Directive, ElementRef, inject, OnDestroy, OnInit, output } from "@angular/core";

/**
 * Directive permettant d'écouter les modifications de la taille
 * de l'élément hôte.
 */
@Directive({ selector: "[gaObserveResize]" })
export class ResizeObserverDirective implements OnInit, OnDestroy {
    private readonly elementRef: ElementRef = inject(ElementRef);

    /**
     * Emet un évènement respectant l'interface {@link DOMRectReadOnly}
     * chaque fois que l'élément hôte est redimensionné.
     */
    public sizeChange = output<DOMRectReadOnly>();

    private readonly _observer: ResizeObserver = this.getResizeObserver();

    public ngOnInit(): void {
        this._observer.observe(this.elementRef.nativeElement);
    }

    public ngOnDestroy(): void {
        this._observer.unobserve(this.elementRef.nativeElement);
        this._observer.disconnect();
    }

    private getResizeObserver(): ResizeObserver {
        return new ResizeObserver((entries) => {
            this.sizeChange.emit(entries[0].contentRect);
        });
    }
}
