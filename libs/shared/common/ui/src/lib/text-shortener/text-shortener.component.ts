import { Component, InputSignal, Signal, computed, input } from "@angular/core";

import { TooltipModule } from "@openng/optimus-ui/tooltip";

import { AvailablePosition } from "../models";
import { EllipsisPipe } from "../pipes/ellipsis/ellipsis.pipe";

export const DEFAULT_MAX_LENGTH: number = 50;

/**
 * Component qui permet de limiter la taille du texte passé en input à la propriété label.
 * Affiche le texte avec une ellipse ainsi qu'une info bulle au survol dès lors que la taille maximale donnée
 * est dépassée.
 */
@Component({
    selector: "abm-text-shortener",
    templateUrl: "./text-shortener.component.html",
    styleUrl: "./text-shortener.component.scss",
    imports: [EllipsisPipe, TooltipModule],
})
export class TextShortenerComponent {
    /**
     * Le libellé dont on veut limiter la taille.
     */
    public readonly labelSnl: InputSignal<string> = input.required<string>({
        alias: "label",
    });

    /**
     * Longueur maximale de la chaîne de caractères avant affichage
     * de l'info bulle ainsi que de l'ellipse.
     */
    public readonly maxLengthSnl: InputSignal<number> = input<number>(DEFAULT_MAX_LENGTH, {
        alias: "maxLength",
    });

    /**
     * Position du tooltip primeNG. Les options valides sont 'right' | 'left' | 'top' | 'bottom'.;
     */
    public readonly tooltipPositionSnl: InputSignal<AvailablePosition> = input<AvailablePosition>("right", {
        alias: "tooltipPosition",
    });

    /**
     * Suffixe à ajouter lorsque la chaîne de caractères est coupée.
     */
    public readonly suffixSnl: InputSignal<string | null> = input<string | null>(null, {
        alias: "suffix",
    });

    public readonly isTooltipDisabledSnl: Signal<boolean> = computed(() => {
        return this.labelSnl().length < this.maxLengthSnl();
    });
}
