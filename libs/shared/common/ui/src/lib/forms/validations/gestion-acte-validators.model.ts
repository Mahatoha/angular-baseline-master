import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export type MessagePriority = Omit<number, 1>;

export abstract class ARegionSudValidators {
    public static required: (control: AbstractControl) => RequiredValidationError | null;
    public static min: (
        minValue: number,
        strict: boolean,
        priority?: number
    ) => (control: AbstractControl) => MinValidationError | null;
    public static max: (
        maxValue: number,
        strict: boolean,
        priority?: number
    ) => (control: AbstractControl) => MaxValidationError | null;
    public static minLength: (
        minLength: number,
        priority?: number
    ) => (control: AbstractControl) => MinLengthValidationError | null;
    public static maxLength: (
        maxLength: number,
        priority?: number
    ) => (control: AbstractControl) => MaxLengthValidationError | null;
    public static email: (priority?: number) => (ctrl: AbstractControl) => EmailValidationError | null;
    public static customErrorValidator: (
        validator: ValidatorFn,
        customError: ValidationErrors & { priority?: MessagePriority }
    ) => (ValidationErrors & { priority?: MessagePriority }) | null;
}

export interface BaseError {
    priority?: MessagePriority;
}

export interface RequiredValidationError {
    required: RequiredError;
}

export interface EmailValidationError {
    email: EmailError;
}

export interface MinValidationError {
    min: MinError;
}

export interface MaxValidationError {
    max: MaxError;
}

export interface MinLengthValidationError {
    minLength: LengthError;
}

export interface MaxLengthValidationError {
    maxLength: LengthError;
}

export interface MinError extends BaseError {
    minimumValue: number;
}

export interface MaxError extends BaseError {
    maximumValue: number;
}

export interface RequiredError extends BaseError {
    priority: 1;
}

export interface LengthError extends BaseError {
    requiredLength: number;
    actualLength: number;
}

export type EmailError = BaseError;

export type GestionActeError = EmailValidationError & RequiredValidationError & MaxError & MinError & LengthError;
export type GEstionActeValidationErrors = EmailValidationError &
    RequiredValidationError &
    MinValidationError &
    MaxValidationError &
    MinLengthValidationError &
    MaxLengthValidationError;

export type GestionActeErrorMessages = Record<keyof GEstionActeValidationErrors, (args: GestionActeError) => string>;
