import { FormControl } from "@angular/forms";

import { GestionActeValidators } from "./gestion-acte.validators";

describe("GestionActeValidators", () => {
    describe("required", () => {
        const expectedError = { required: { priority: 1 } };

        it("should return a requiredValidationError if the control value is null", () => {
            // Arrange
            const testControl = new FormControl(null, GestionActeValidators.required);

            // Act
            const errors = testControl.errors;

            // Assert
            expect(errors).toEqual(expectedError);
        });

        it("should return a requiredValidationError if the control value is undefined", () => {
            // Arrange
            const testControl = new FormControl(undefined, GestionActeValidators.required);
            const errors = testControl.errors;

            // Assert
            expect(errors).toEqual(expectedError);
        });

        it("should return a requiredValidationError if the control value is an empty string", () => {
            // Arrange
            const testControl = new FormControl("", GestionActeValidators.required);
            const errors = testControl.errors;

            // Assert
            expect(errors).toEqual(expectedError);
        });

        it("should return a requiredValidationError if the control value is an empty object", () => {
            // Arrange
            const testControl = new FormControl({}, GestionActeValidators.required);
            const errors = testControl.errors;

            // Assert
            expect(errors).toEqual(expectedError);
        });

        it("should NOT return a requiredValidationError if the control value is a Date", () => {
            // Arrange
            const testControl = new FormControl(new Date(), GestionActeValidators.required);
            const errors = testControl.errors;

            // Assert
            expect(errors).toBeNull();
        });

        it("should NOT return an error if the control value is filled", () => {
            // Arrange
            const testControl = new FormControl("filledValue", GestionActeValidators.required);
            const errors = testControl.errors;

            // Assert
            expect(errors).toBeNull();
        });
    });

    describe("min", () => {
        it("should return a minValidationError if the control value is lesser than the provided minimum", () => {
            // Arrange
            const minimumValue: number = 10;
            const testControl = new FormControl(5, GestionActeValidators.min(minimumValue));
            const errors = testControl.errors;
            const expectedError = { min: { minimumValue } };

            // Assert
            expect(errors).toEqual(expectedError);
        });

        it("should return a minValidationError if the control value is lesser than or equal the provided minimum in strict mode", () => {
            // Arrange
            const minimumValue: number = 10;
            const testControl = new FormControl(10, GestionActeValidators.min(minimumValue, true));
            const errors = testControl.errors;
            const expectedError = { min: { minimumValue } };

            // Assert
            expect(errors).toEqual(expectedError);
        });

        it("should return a priority in the error payload when it's provided", () => {
            // Arrange
            const priority = 4;
            const minimumValue = 5;
            const testControl = new FormControl(0, GestionActeValidators.min(minimumValue, false, priority));
            const expectedError = { min: { minimumValue, priority } };

            // Assert
            expect(testControl.errors).toEqual(expectedError);
        });

        it("should NOT return an error when the control is valid", () => {
            // Arrange
            const minimumValue = 1;
            const testControl = new FormControl(10, GestionActeValidators.min(minimumValue));

            // Assert
            expect(testControl.errors).toBeNull();
        });
    });

    describe("max", () => {
        it("should return a maxValidationError if the control value is greater than the provided maximum", () => {
            // Arrange
            const maximumValue: number = 5;
            const testControl = new FormControl(10, GestionActeValidators.max(maximumValue));
            const errors = testControl.errors;
            const expectedError = { max: { maximumValue } };

            // Assert
            expect(errors).toEqual(expectedError);
        });

        it("should return a maxValidationError if the control value is greater than or equal the provided maximum in strict mode", () => {
            // Arrange
            const maximumValue: number = 10;
            const testControl = new FormControl(10, GestionActeValidators.max(maximumValue, true));
            const errors = testControl.errors;
            const expectedError = { max: { maximumValue } };

            // Assert
            expect(errors).toEqual(expectedError);
        });

        it("should return a priority in the error payload when it's provided", () => {
            // Arrange
            const priority = 4;
            const maximumValue = 2;
            const testControl = new FormControl(3, GestionActeValidators.max(maximumValue, false, priority));
            const expectedError = { max: { maximumValue, priority } };

            // Assert
            expect(testControl.errors).toEqual(expectedError);
        });

        it("should NOT return an error when the control is valid", () => {
            // Arrange
            const maximumValue = 10;
            const testControl = new FormControl(1, GestionActeValidators.max(maximumValue));

            // Assert
            expect(testControl.errors).toBeNull();
        });
    });

    describe("minLength", () => {
        it("should return a minLengthValidationError if the control value is null", () => {
            const requiredLength: number = 10;
            const testControl = new FormControl(null, GestionActeValidators.minLength(requiredLength));
            const errors = testControl.errors;
            const expectedError = { minLength: { requiredLength, actualLength: 0 } };

            // Assert
            expect(errors).toEqual(expectedError);
        });

        it("should return a minLengthValidationError if the control value is lesser than the required length", () => {
            // Arrange
            const requiredLength: number = 10;
            const testValue = "Tata";
            const testControl = new FormControl(testValue, GestionActeValidators.minLength(requiredLength));
            const errors = testControl.errors;
            const expectedError = { minLength: { requiredLength, actualLength: testValue.length } };

            // Assert
            expect(errors).toEqual(expectedError);
        });

        it("should return a priority in the error payload when it's provided", () => {
            // Arrange
            const priority = 4;
            const requiredLength = 5;
            const testValue = "abc";
            const testControl = new FormControl(
                testValue,
                GestionActeValidators.minLength(requiredLength, priority)
            );
            const expectedError = { minLength: { requiredLength, actualLength: testValue.length, priority } };

            // Assert
            expect(testControl.errors).toEqual(expectedError);
        });

        it("should NOT return an error when the control is valid", () => {
            // Arrange
            const requiredLength = 1;
            const testControl = new FormControl("Toto", GestionActeValidators.minLength(requiredLength));

            // Assert
            expect(testControl.errors).toBeNull();
        });

        it("should throw an error if the control value is NOT a string", () => {
            // Act, Assert
            expect(() => new FormControl(42, GestionActeValidators.minLength(10))).toThrow(
                "Le validator minLength doit être appliqué sur un controle de type string"
            );
        });
    });

    describe("maxLength", () => {
        it("should return a maxLengthValidationError if the control value is lesser than the required length", () => {
            // Arrange
            const requiredLength: number = 2;
            const testValue = "Tata";
            const testControl = new FormControl(testValue, GestionActeValidators.maxLength(requiredLength));
            const errors = testControl.errors;
            const expectedError = { maxLength: { requiredLength, actualLength: testValue.length } };

            // Assert
            expect(errors).toEqual(expectedError);
        });

        it("should return a priority in the error payload when it's provided", () => {
            // Arrange
            const priority = 4;
            const requiredLength = 1;
            const testValue = "abc";
            const testControl = new FormControl(
                testValue,
                GestionActeValidators.maxLength(requiredLength, priority)
            );
            const expectedError = { maxLength: { requiredLength, actualLength: testValue.length, priority } };

            // Assert
            expect(testControl.errors).toEqual(expectedError);
        });

        it("should NOT return an error when the control is valid", () => {
            // Arrange
            const requiredLength = 10;
            const testControl = new FormControl("Toto", GestionActeValidators.maxLength(requiredLength));

            // Assert
            expect(testControl.errors).toBeNull();
        });

        it("should throw an error if the control value is NOT a string", () => {
            // Act, Assert
            expect(() => new FormControl(42, GestionActeValidators.maxLength(10))).toThrow(
                "Le validator maxLength doit être appliqué sur un controle de type string"
            );
        });
    });

    describe("email", () => {
        it("should return an emailValidationError if the control value is not a valid email format", () => {
            // Arrange
            const testControl = new FormControl("@coucou.fr", GestionActeValidators.email());
            const expectedError = { email: {} };

            // Assert
            expect(testControl.errors).toEqual(expectedError);
        });

        it("should return a priority in the error payload when it's provided", () => {
            // Arrange
            const priority = 4;
            const testControl = new FormControl("@coucou.fr", GestionActeValidators.email(priority));
            const expectedError = { email: { priority } };

            // Assert
            expect(testControl.errors).toEqual(expectedError);
        });

        it("should NOT return an error when the control value is a valid email format", () => {
            // Arrange
            const testControl = new FormControl("coucou@coucou.fr", GestionActeValidators.email());

            // Assert
            expect(testControl.errors).toBeNull();
        });
    });
});