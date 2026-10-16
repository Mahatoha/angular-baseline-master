import {
    EmailValidationError,
    LengthError,
    MaxError,
    MinError,
    GestionActeErrorMessages,
    RequiredValidationError,
} from "../gestion-acte-validators.model";

export const GA_ERROR_MESSAGES: GestionActeErrorMessages = {
    required: (_: RequiredValidationError) => "Champ obligatoire.",
    email: (_: EmailValidationError) => `L'adresse e-mail est invalide.`,
    min: ({ minimumValue }: MinError) => `La valeur du champ doit être supérieure à ${minimumValue.toLocaleString()}.`,
    max: ({ maximumValue }: MaxError) => `La valeur du champ doit être inférieure à ${maximumValue.toLocaleString()}.`,
    minLength: ({ requiredLength }: LengthError) =>
        `La longueur du champ doit être supérieure ou égale à ${requiredLength} caractères.`,
    maxLength: ({ requiredLength }: LengthError) =>
        `La longueur du champ doit être inférieure ou égale à ${requiredLength} caractères.`,
};
