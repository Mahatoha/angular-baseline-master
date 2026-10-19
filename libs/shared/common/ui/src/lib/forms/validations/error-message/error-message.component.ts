import { Component, ChangeDetectorRef, ViewEncapsulation, inject, input, InputSignal } from "@angular/core";
import { NgControl } from "@angular/forms";

import { ErrMessages } from "../control-errors.model";

@Component({
    selector: "abm-error-message",
    templateUrl: "./error-message.component.html",
    styleUrls: ["./error-message.component.scss"],
    encapsulation: ViewEncapsulation.None,
    // eslint-disable-next-line @angular-eslint/prefer-standalone
    standalone: false,
})
export class ErrorMessageComponent {
    public cdRef: ChangeDetectorRef = inject(ChangeDetectorRef);

    public controlSnl: InputSignal<NgControl> = input.required({ alias: "control" });
    public errorMessagesSnl: InputSignal<ErrMessages | undefined> = input<ErrMessages | undefined>(undefined, {
        alias: "errorMessages",
    });
}
