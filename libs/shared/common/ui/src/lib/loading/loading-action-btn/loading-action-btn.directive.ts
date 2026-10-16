import { Directive, inject, Inject, input, InputSignal, OnDestroy, OnInit } from "@angular/core";

import { Button, ButtonDirective } from "@openng/optimus-ui/button";
import { Subject, takeUntil } from "rxjs";

import { ACTION_NOTIFIER, ActionNotifier } from "../../models/action-notifier.model";

/**
 * Directive qui permet d'afficher le loader natif des boutons PrimeNg
 * lorsqu'une action donnée est en cours d'exécution.
 */
@Directive({ selector: "p-button[gaLoadingBtn], [pButton][gaLoadingBtn]", standalone: true })
export class LoadingBtnDirective implements OnInit, OnDestroy {
    @Inject(ACTION_NOTIFIER) private readonly actionNotifierService: ActionNotifier = inject(ACTION_NOTIFIER);
    private readonly buttonDirective: ButtonDirective | null = inject(ButtonDirective, { optional: true, self: true });
    private readonly button: Button | null = inject(Button, { optional: true, self: true });

    /**
     * L'action à écouter sur laquelle se déclenche l'apparition
     * et la disparition du loader.
     */
    public loadingActionSnl: InputSignal<string> = input("", { alias: "loadingAction" });

    /**
     * Identifiant de l'entité lorsque l'action écoutée ne doit l'être que pour
     * une entité spécifique.
     */
    public entityIdSnl: InputSignal<number | null> = input<number | null>(null, { alias: "entityId" });

    private readonly pButton: ButtonDirective | Button | null;

    private readonly disposeSignal$ = new Subject<void>();

    constructor() {
        if (this.buttonDirective === null && this.button === null) {
            throw new Error(
                "La directive doit être appliquée sur un p-button ou un bouton comportant la directive pButton"
            );
        }

        this.pButton = this.buttonDirective ?? this.button;
    }

    public ngOnInit(): void {
        this.actionNotifierService
            .onChange(this.loadingActionSnl(), this.entityIdSnl() ?? undefined)
            .pipe(takeUntil(this.disposeSignal$))
            .subscribe((isRunning) => {
                if (this.pButton !== null) {
                    this.pButton.loading = isRunning;
                }
            });
    }

    public ngOnDestroy(): void {
        this.disposeSignal$.next();
        this.disposeSignal$.complete();
    }
}
