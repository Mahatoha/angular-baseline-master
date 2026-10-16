import { Directive, inject, input, InputSignal, Renderer2 } from "@angular/core";

import { DEFAULT_SCALING_RATIO } from "./transformations.const";
import { HostListenerDirective } from "../../common";

/**
 * Classe de base qui permet d'hériter de la fonctionnalité
 * d'ajout de la propriété transform:scale sur un évènement donné.
 */
@Directive()
export abstract class ScaleDirective extends HostListenerDirective {
    private readonly renderer: Renderer2 = inject(Renderer2);

    /**
     * Ratio à appliquer comme valeur à la propriété css transform: scale().
     */
    public scalingRatioSnl: InputSignal<number> = input(DEFAULT_SCALING_RATIO, { alias: "scalingRatio" });

    protected triggerHandler(): void {
        const transformValue: string = `scale(${(this.scalingRatioSnl(), this.scalingRatioSnl())})`;
        this.renderer.setStyle(this.elementRef.nativeElement, "transform", transformValue);
    }

    protected unsetHandler(): void {
        this.renderer.removeStyle(this.elementRef.nativeElement, "transform");
    }
}
