import { Component, input, TemplateRef } from "@angular/core";

import { TooltipModule } from "@openng/optimus-ui/tooltip";

/**
 * Simple bulle d'aide qui affiche un tooltip au survol.
 * Utiliser la directive [gaHint] pour ajouter l'icone de l'info bulle sur une balise existante.
 * Utiliser le composant <abm-hint> pour afficher directement l'icone de l'info bulle.
 */
@Component({
    selector: "abm-hint, [gaHint]",
    templateUrl: "./hint.component.html",
    styleUrls: ["./hint.component.scss"],
    imports: [TooltipModule],
})
export class HintComponent {
    /**
     * Informations additionnelles à afficher à l'interieur du tooltip
     * au survol de l'icône d'aide.
     */
    public readonly hintSnl = input.required<string | TemplateRef<HTMLElement>>({ alias: "gaHint" });
}
