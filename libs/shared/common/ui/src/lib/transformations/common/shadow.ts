import { Directive, inject, input, InputSignal, Renderer2 } from "@angular/core";

import { DEFAULT_BOX_SHADOW } from "./transformations.const";
import { HostListenerDirective } from "../../common";

/**
 * Classe de base qui permet d'hériter de la fonctionnalité
 * d'ajout de la propriété box-shadow sur un évènement donné.
 */
@Directive()
export abstract class ShadowDirective extends HostListenerDirective {
    private readonly renderer: Renderer2 = inject(Renderer2);

    /**
     * Box shadow à appliquer à la propriété box-shadow.
     */
    public shadowSnl: InputSignal<string> = input(DEFAULT_BOX_SHADOW, { alias: "shadow" });

    protected triggerHandler(): void {
        this.renderer.setStyle(this.elementRef.nativeElement, "box-shadow", this.shadowSnl());
    }

    protected unsetHandler(): void {
        this.renderer.removeStyle(this.elementRef.nativeElement, "box-shadow");
    }
}
