import { AsyncPipe } from "@angular/common";
import { Component, InputSignal, OnInit, inject, input } from "@angular/core";

import { ButtonModule } from "@openng/optimus-ui/button";
import { SplitButtonModule } from "@openng/optimus-ui/splitbutton";
import { Observable } from "rxjs";

import { ACTION_NOTIFIER, ActionNotifier } from "../../models/action-notifier.model";

/**
 * Remplace le contenu projeté par un bouton avec un loader
 * lorsque une action donnée est en cours d'exécution.
 */
@Component({
    selector: "ga-loading-action-btn, [gaLoadingActionBtn]",
    templateUrl: "./loading-action-btn.component.html",
    imports: [AsyncPipe, ButtonModule, SplitButtonModule],
})
export class LoadingActionBtnComponent implements OnInit {
    private readonly actionNotifier: ActionNotifier = inject(ACTION_NOTIFIER);

    /**
     * Label du bouton lorsque l'état de chargement est inactif.
     */
    public labelSnl: InputSignal<string> = input("", { alias: "label" });

    /**
     * L'action à écouter sur laquelle se déclenche l'apparition
     * et la disparition du loader.
     */
    public loadingActionSnl: InputSignal<string> = input("", { alias: "loadingAction" });

    /**
     * Texte à afficher comme label du bouton lorsque l'état de chargement est actif.
     */
    public loadingTextSnl: InputSignal<string> = input("", { alias: "loadingText" });

    public entityIdSnl: InputSignal<number | null> = input<number | null>(null, { alias: "entityId" });

    public buttonClassSnl: InputSignal<string | null> = input<string | null>(null, { alias: "buttonClass" });

    /**
     * Observable qui contient l'état de l'action qui permet de déterminer
     * l'état de chargement actif ou inactif.
     */
    public isActionRunning$!: Observable<boolean>;

    public ngOnInit(): void {
        this.isActionRunning$ = this.actionNotifier.onChange(this.loadingActionSnl(), this.entityIdSnl() ?? undefined);
    }
}
