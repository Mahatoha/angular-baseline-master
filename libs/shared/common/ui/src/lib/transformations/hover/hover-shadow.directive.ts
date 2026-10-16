import { Directive } from "@angular/core";

import { ShadowDirective } from "../common/shadow";

/**
 * Ajoute la box shadow déterminée via les propriétés
 * de la classe parente {@link ShadowDirective} au hover
 * sur l'élément hôte.
 */
@Directive({ selector: "[gaHoverShadow]" })
export class HoverShadowDirective extends ShadowDirective {
    protected triggerEvent: "mouseenter" = "mouseenter" as const;
    protected unsetEvent: "mouseleave" = "mouseleave" as const;
}
