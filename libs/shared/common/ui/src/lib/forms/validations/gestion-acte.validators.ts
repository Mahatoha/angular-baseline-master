import { Service } from "@angular/core";
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";

import {
    ARegionSudValidators,
    EmailValidationError,
    MaxLengthValidationError,
    MaxValidationError,
    MessagePriority,
    MinLengthValidationError,
    MinValidationError,
    RequiredValidationError,
} from "./gestion-acte-validators.model";

@Service({ autoProvided: false })
export class GestionActeValidators extends ARegionSudValidators {
    public static override required(control: AbstractControl): RequiredValidationError | null {
        let value: unknown = control.value;
        if (typeof value === "string") {
            value = value.trim();
        }

        if (
            value == null ||
            value === "" ||
            (Array.isArray(value) && value.length === 0) ||
            (typeof value === "object" &&
                ((value instanceof Date && isNaN(value.valueOf())) ||
                    (!(value instanceof Date) && Object.keys(value).length === 0)))
        ) {
            return { required: { priority: 1 } };
        }

        return null;
    }

    public static override min(
        minValue: number,
        strict: boolean = false,
        priority?: MessagePriority
    ): (ctrl: AbstractControl) => MinValidationError | null {
        return (control: AbstractControl): MinValidationError | null => {
            const error: MinValidationError = { min: { minimumValue: minValue } };
            if (strict && control.value <= minValue) {
                return error;
            }
            return Validators.min(minValue)(control) === null ? null : { min: { minimumValue: minValue, priority } };
        };
    }

    public static override max(
        maxValue: number,
        strict: boolean = false,
        priority?: MessagePriority
    ): (ctrl: AbstractControl) => MaxValidationError | null {
        return (control: AbstractControl): MaxValidationError | null => {
            const error: MaxValidationError = { max: { maximumValue: maxValue } };
            if (strict && control.value >= maxValue) {
                return error;
            }
            return Validators.max(maxValue)(control) === null ? null : { max: { maximumValue: maxValue, priority } };
        };
    }

    public static override minLength(
        minLength: number,
        priority?: MessagePriority
    ): (ctrl: AbstractControl) => MinLengthValidationError | null {
        return (control: AbstractControl): MinLengthValidationError | null => {
            const value: unknown = control.value;
            if (typeof value !== "string" && value !== null) {
                throw new Error("Le validator minLength doit être appliqué sur un controle de type string");
            }

            if (value === null || value.trim().length < minLength) {
                return {
                    minLength: {
                        requiredLength: minLength,
                        actualLength: value?.trim().length ?? 0,
                        priority,
                    },
                };
            }

            return null;
        };
    }

    public static override maxLength(
        maxLength: number,
        priority?: MessagePriority
    ): (ctrl: AbstractControl) => MaxLengthValidationError | null {
        return (control: AbstractControl): MaxLengthValidationError | null => {
            const value: unknown = control.value;
            if (typeof value !== "string" && value !== null) {
                throw new Error("Le validator maxLength doit être appliqué sur un controle de type string");
            }

            if (value !== null && value.trim().length > maxLength) {
                return {
                    maxLength: {
                        requiredLength: maxLength,
                        actualLength: value.trim().length,
                        priority,
                    },
                };
            }

            return null;
        };
    }

    public static override email(priority?: MessagePriority): (ctrl: AbstractControl) => EmailValidationError | null {
        return (control: AbstractControl) => {
            return Validators.email(control) === null ? null : { email: { priority } };
        };
    }

    public static override customErrorValidator(
        validator: ValidatorFn,
        customError: ValidationErrors
    ): ValidationErrors | null {
        return (control: AbstractControl): ValidationErrors | null => {
            return validator(control) != null ? customError : null;
        };
    }
}
