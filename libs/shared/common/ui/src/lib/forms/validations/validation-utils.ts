import { AbstractControl, ValidatorFn } from "@angular/forms";

import { Subject, distinctUntilChanged, takeUntil } from "rxjs";

import { GestionActeValidators } from "./gestion-acte.validators";

export function applyMinMaxValidation(
    minControl: AbstractControl<number | null>,
    maxControl: AbstractControl<number | null>,
    disposeSignal$: Subject<void>,
    strict: boolean = false
): void {
    const initMinValidators: Array<ValidatorFn> = minControl.validator ? [minControl.validator] : [];
    const initMaxValidators: Array<ValidatorFn> = maxControl.validator ? [maxControl.validator] : [];
    minControl.valueChanges.pipe(distinctUntilChanged(), takeUntil(disposeSignal$)).subscribe((x) => {
        maxControl.setValidators([...initMaxValidators, GestionActeValidators.min(x ?? Number.MIN_VALUE, strict)]);
        maxControl.markAsDirty();
        maxControl.updateValueAndValidity();
    });
    maxControl.valueChanges.pipe(distinctUntilChanged(), takeUntil(disposeSignal$)).subscribe((x) => {
        minControl.setValidators([...initMinValidators, GestionActeValidators.max(x ?? Number.MAX_VALUE, strict)]);
        minControl.markAsDirty();
        minControl.updateValueAndValidity();
    });
}
