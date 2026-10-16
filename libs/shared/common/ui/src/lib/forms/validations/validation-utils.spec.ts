import { FormControl, FormGroup } from "@angular/forms";

import { Subject } from "rxjs";

import { applyMinMaxValidation } from "./validation-utils";

describe("Validation utils", () => {
    let disposeSignal$: Subject<void>;

    describe("applyMinMaxValidation", () => {
        const formGroup = new FormGroup({
            min: new FormControl(),
            max: new FormControl(),
        });

        disposeSignal$ = new Subject();

        afterEach(() => {
            formGroup.reset();
            disposeSignal$.next();
            disposeSignal$.complete();
        });

        it("should prevent the minimum control value to be greater than the maximum control value", () => {
            // Arrange
            applyMinMaxValidation(formGroup.controls.min, formGroup.controls.max, disposeSignal$);
            const maximumValue = 10;
            const expectedError = { max: { maximumValue } };

            // Act
            formGroup.controls.max.setValue(maximumValue);
            formGroup.controls.min.setValue(15);

            // Assert
            expect(formGroup.controls.min.errors).toEqual(expectedError);
        });

        it("should prevent the minimum control value to be greater than or equal the maximum control value in strict mode", () => {
            // Arrange
            applyMinMaxValidation(formGroup.controls.min, formGroup.controls.max, disposeSignal$, true);
            const maximumValue = 10;
            const expectedError = { max: { maximumValue } };

            // Act
            formGroup.controls.max.setValue(maximumValue);
            formGroup.controls.min.setValue(10);

            // Assert
            expect(formGroup.controls.min.errors).toEqual(expectedError);
        });

        it("should prevent the maximum control value to be lesser than the minimum value", () => {
            // Arrange
            applyMinMaxValidation(formGroup.controls.min, formGroup.controls.max, disposeSignal$);
            const minimumValue = 10;
            const expectedError = { min: { minimumValue } };

            // Act
            formGroup.controls.min.setValue(minimumValue);
            formGroup.controls.max.setValue(8);

            // Assert
            expect(formGroup.controls.max.errors).toEqual(expectedError);
        });

        it("should prevent the maximum control value to be lesser than or equal the minimum value in strict mode", () => {
            // Arrange
            applyMinMaxValidation(formGroup.controls.min, formGroup.controls.max, disposeSignal$, true);
            const minimumValue = 10;
            const expectedError = { min: { minimumValue } };

            // Act
            formGroup.controls.min.setValue(minimumValue);
            formGroup.controls.max.setValue(10);

            // Assert
            expect(formGroup.controls.max.errors).toEqual(expectedError);
        });
    });
});