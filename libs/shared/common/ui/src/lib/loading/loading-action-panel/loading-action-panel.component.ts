import { AsyncPipe } from "@angular/common";
import { Component, InputSignal, OnInit, inject, input } from "@angular/core";

import { Observable, debounceTime } from "rxjs";

import { fadeInAnimation } from "../../animations";
import { AvailableSize } from "../../models";
import { ACTION_NOTIFIER, ActionNotifier } from "../../models/action-notifier.model";
import { LoaderComponent } from "../loader/loader.component";

/**
 * Affiche un loader et un texte éventuel à la place du contenu projeté
 * lorsqu'une action donnée est en cours d'exécution.
 */
@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: "section[gaLoadingActionPanel]",
    templateUrl: "./loading-action-panel.component.html",
    styleUrls: ["./loading-action-panel.component.scss"],
    imports: [AsyncPipe, LoaderComponent],
    animations: [fadeInAnimation],
})
export class LoadingActionPanelComponent implements OnInit {
    private readonly actionNotifier: ActionNotifier = inject(ACTION_NOTIFIER);

    /**
     * L'action à écouter sur laquelle se déclenche l'apparition
     * et la disparition du loader.
     */
    public actionSnl: InputSignal<string> = input("", { alias: "action" });

    /**
     * Détermine l'affichage d'un overlay empêchant toute action
     * utilisateur durant le temps de chargement.
     */
    public isFullScreenSnl: InputSignal<boolean> = input(false, { alias: "isFullScreen" });

    /**
     * Détermine la taille du loader à afficher.
     */
    public loaderSizeSnl: InputSignal<AvailableSize> = input<AvailableSize>("md", { alias: "loaderSize" });

    /**
     * Texte additionnel à afficher durant le temps de chargement
     * sous le loader.
     */
    public loadingTextSnl: InputSignal<string | null> = input<string | null>(null, { alias: "loadingText" });

    /**
     * Identifiant de l'entité lorsque l'action écoutée ne doit l'être que pour
     * une entité spécifique.
     */
    public entityIdSnl: InputSignal<number | null> = input<number | null>(null, { alias: "entityId" });

    /**
     * Observable qui contient l'état de l'action qui permet de déterminer
     * l'état de chargement actif ou inactif.
     */
    public isActionRunning$!: Observable<boolean>;

    /**
     * Delai avant l'affichage du loader. Utile pour éviter les effets de scintillement
     * lorsque le temps de chargement est très court.
     */
    public readonly SHOW_LOADER_DELAY: number = 150;

    public ngOnInit(): void {
        this.isActionRunning$ = this.actionNotifier
            .onChange(this.actionSnl(), this.entityIdSnl() ?? undefined)
            .pipe(debounceTime(this.SHOW_LOADER_DELAY));
    }
}
