import { AsyncPipe } from "@angular/common";
import { Component, InputSignal, Signal, computed, inject, input } from "@angular/core";

import { Observable } from "rxjs";

import { AVATAR_CONFIG, AvatarInitialesConfiguration } from "./avatar-initiales-configuration.token";
import { slideAvatarInitiales } from "./avatar-initiales.animation";
import { OverlapCircleDirective } from "./overlap-circle.directive";
import { ToInitialesPipe } from "./to-initiales.pipe";
import { AvailableSize } from "../models/size.model";
import { HoverScaleDirective, HoverShadowDirective } from "../transformations";

/**
 * Composant présentant les initiales de l'utilisateur
 * sous forme d'avatar.
 *
 * Il est possible d'ajouter des actions au clic sur l'avatar.
 */
@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: "div[abm-avatar-initiales]",
    templateUrl: "./avatar-initiales.component.html",
    styleUrls: ["./avatar-initiales.component.scss"],
    imports: [AsyncPipe, OverlapCircleDirective, HoverScaleDirective, HoverShadowDirective, ToInitialesPipe],
    animations: [slideAvatarInitiales],
})
export class AvatarInitialesComponent {
    public readonly avatarConfig$: Observable<AvatarInitialesConfiguration> | null = inject(AVATAR_CONFIG, {
        optional: true,
    });

    public isSingleModeSnl: InputSignal<boolean> = input<boolean>(false, {
        alias: "isSingleMode",
    });

    public nomSnl: InputSignal<string> = input<string>("", {
        alias: "nom",
    });

    public prenomSnl: InputSignal<string> = input<string>("", {
        alias: "prenom",
    });

    public klassesSnl: InputSignal<Array<string>> = input<Array<string>>([], {
        alias: "klasses",
    });

    public sizeSnl: InputSignal<AvailableSize> = input<AvailableSize>("sm", {
        alias: "size",
    });

    public sizeClassSnl: Signal<string> = computed(() => this.convertSizeToClass(this.sizeSnl()));

    private convertSizeToClass(size: AvailableSize): string {
        switch (size) {
            case "sm":
                return "circle--sm";
            case "md":
                return "circle--md";
            case "lg":
                return "circle--lg";
        }
    }
}
