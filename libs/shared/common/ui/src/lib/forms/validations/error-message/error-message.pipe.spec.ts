import { ValidationErrors } from "@angular/forms";

import { ErrorMessagesPipe } from "./error-message.pipe";
import { GestionActeErrorMessages } from "../gestion-acte-validators.model";
import { GA_ERROR_MESSAGES } from "./error-message.const";
import { TestBed } from "@angular/core/testing";
import { ERROR_MESSAGES } from "./error-message.token";

describe("ErrorMessagePipe", () => {
    let errorMessagePipe: ErrorMessagesPipe;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: ERROR_MESSAGES, useValue: GA_ERROR_MESSAGES},
                ErrorMessagesPipe
            ],
        });
        errorMessagePipe = TestBed.inject(ErrorMessagesPipe);
    });

    it("should return an empty string if there is no validation error", () => {
        // Arrange
        const validationErrors = null;

        // Act
        const displayedError: string = errorMessagePipe.transform(validationErrors);

        // Assert
        expect(displayedError).toEqual("");
    });

    it("should retrieve the corresponding message for the validation error received as parameter", () => {
        // Arrange
        const validationErrors: ValidationErrors = {
            required: true,
        };

        // Act
        const displayedError: string = errorMessagePipe.transform(validationErrors);
        const expectedError: string = GA_ERROR_MESSAGES.required(validationErrors["required"]);

        // Assert
        expect(displayedError).toEqual(expectedError);
    });

    /** For sake of brevity we directly provide and access default errors and error messages */
    it("should only return a single error even if there is more than one validation error", () => {
        // Arrange
        const validationErrors: ValidationErrors = {
            max: { maximumValue: 4 },
            min: { minimumValue: 5 },
        };

        // Act
        const displayedError: string = errorMessagePipe.transform(validationErrors);
        const humanizedErrors: Array<ValidationErrors> = Object.entries(validationErrors).filter(([key, value]) =>
            displayedError.includes(GA_ERROR_MESSAGES[key as keyof GestionActeErrorMessages](value))
        );

        // Assert
        expect(humanizedErrors.length).toEqual(1);
    });

    it("should return the correct error according to the priority order if there is any", () => {
        // Arrange
        const validationErrors: ValidationErrors = {
            max: { maximumValue: 4 },
            min: { minimumValue: 5, priority: 2 },
            minLength: { minimumValue: 10, priority: 5 },
        };

        // Act
        const displayedError: string = errorMessagePipe.transform(validationErrors);
        const expectedError: string = GA_ERROR_MESSAGES.min(validationErrors["min"]);

        // Assert
        expect(displayedError).toEqual(expectedError);
    });

    it("should return a default value for each validation error if there is no match in the injected messages", () => {
        // Arrange
        const defaultError: string = "Champ invalide.";
        const validationErrors: ValidationErrors = {
            customError: true,
        };

        // Act
        const displayedError: string = errorMessagePipe.transform(validationErrors);

        // Assert
        expect(displayedError).toEqual(defaultError);
    });

    it("should always try to use the received custom messages over the default injected messages", () => {
        // Arrange
        const fakeCustomMessage: string = "Fake custom required message";
        const customMessages = {
            required: () => fakeCustomMessage,
        };
        const validationErrors: ValidationErrors = {
            required: true,
        };

        // Act
        const displayedError: string = errorMessagePipe.transform(validationErrors, customMessages);

        // Assert
        expect(displayedError).toEqual(fakeCustomMessage);
    });
});