import { Component, Signal, computed, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";

import { ProgressBarModule } from "@openng/optimus-ui/progressbar";

import { ProgressService } from "../progress.service";

/**
 * Simple barre de progression.
 */
@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: "div[gaProgressBar]",
    templateUrl: "./progress-bar.component.html",
    imports: [ProgressBarModule],
})
export class ProgressBarComponent {
    private readonly progressService: ProgressService = inject(ProgressService);

    /**
     * Signal contenant la valeur actuelle à afficher dans la barre
     * de progression.
     */
    public readonly progressValueSnl: Signal<number>;

    /**
     * Signal contenant la classe à appliquer à la barre de
     * progression.
     */
    public readonly progressClassSnl: Signal<string> = computed(() =>
        this.progressValueSnl() === 0 ? "p-not-animate" : ""
    );

    constructor() {
        this.progressValueSnl = toSignal(this.progressService.progress$, { initialValue: 0 });
    }
}
