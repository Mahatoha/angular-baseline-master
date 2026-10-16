import {
    ComponentRef,
    Directive,
    effect,
    inject,
    input,
    InputSignal,
    OnDestroy,
    ViewContainerRef,
} from "@angular/core";

import { GeneratedComponent } from "./generated-component.model";

/**
 * Directive structurelle permettant de créer un composant dans le container
 * hôte.
 */
@Directive({ selector: "[gaGenerateCmp]" })
export class GenerateComponentDirective<T> implements OnDestroy {
    private readonly viewContainerRef: ViewContainerRef = inject(ViewContainerRef);

    private _componentRef: ComponentRef<T> | null = null;
    private _hasView: boolean = false;

    /**
     * Le composant qui doit être créé dans le container hôte.
     * Doit respecter l'interface {@link GeneratedComponent}.
     */
    public cmpSnl: InputSignal<GeneratedComponent<T>> = input.required({ alias: "cmp" });

    constructor() {
        effect(() => this.buildGeneratedCmp(this.cmpSnl()));
    }

    public ngOnDestroy(): void {
        this.clearView();
    }

    private buildGeneratedCmp(cmp: GeneratedComponent<T>): void {
        if (!this._hasView || this._componentRef === null) {
            this._componentRef = this.viewContainerRef.createComponent(cmp.component);
            this._hasView = true;
        }

        this.assignComponentInputs(cmp, this._componentRef);
    }

    private assignComponentInputs(cmp: GeneratedComponent<T>, componentRef: ComponentRef<T>): void {
        if (cmp.inputs) {
            Object.entries(cmp.inputs).forEach(([key, value]) => {
                const k: keyof T = key as keyof T;
                componentRef.instance[k] = value as T[keyof T];
            });
        }
    }

    private clearView(): void {
        this.viewContainerRef.clear();
        this._componentRef?.destroy();
        this._hasView = false;
    }
}
