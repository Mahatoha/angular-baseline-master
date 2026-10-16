import { Directive } from "@angular/core";

import { ScaleDirective } from "../common/scale";

/**
 * Ajoute un transform:scale déterminée via les propriétés
 * de la classe parente {@link ScaleDirective} au hover
 * sur l'élément hôte.
 */
@Directive({ selector: "[gaHoverScale]" })
export class HoverScaleDirective extends ScaleDirective {
    protected triggerEvent: "mouseenter" = "mouseenter" as const;
    protected unsetEvent: "mouseleave" = "mouseleave" as const;
}
