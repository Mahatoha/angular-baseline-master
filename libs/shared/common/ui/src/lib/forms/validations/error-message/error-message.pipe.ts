import { inject, Pipe, PipeTransform } from "@angular/core";
import { ValidationErrors } from "@angular/forms";

import { ERROR_MESSAGES } from "./error-message.token";
import { ErrMessages } from "../control-errors.model";
import { GestionActeError, GestionActeErrorMessages } from "../gestion-acte-validators.model";

// eslint-disable-next-line @angular-eslint/prefer-standalone
@Pipe({ name: "errorMessages", standalone: false })
export class ErrorMessagesPipe implements PipeTransform {
    private readonly messages: GestionActeErrorMessages = inject(ERROR_MESSAGES);

    public transform(validationErrors: ValidationErrors | null, customMessages?: ErrMessages | null): string {
        if (validationErrors == null) {
            return "";
        }

        const messages: ValidationErrors = {
            ...this.messages,
            ...customMessages,
        };

        const messageKey: string = this.getPrioritizedMessageKey(validationErrors);
        const getMessage: (args: GestionActeError) => string = messages[messageKey];

        if (typeof getMessage === "function") {
            return getMessage(validationErrors[messageKey]);
        }

        return "Champ invalide.";
    }

    private getPrioritizedMessageKey(validationsErrors: ValidationErrors): string {
        return (
            Object.keys(validationsErrors).sort((a, b) => {
                const aPriority: number = validationsErrors[a].priority ?? Number.POSITIVE_INFINITY;
                const bPriority: number = validationsErrors[b].priority ?? Number.POSITIVE_INFINITY;
                return aPriority - bPriority;
            })[0] ?? ""
        );
    }
}
