import { EllipsisPipe } from "./ellipsis.pipe";

describe("EllipsisPipe", () => {
    const ellipsisPipe = new EllipsisPipe();

    it("should add the provided ellipsis when the length of the received value is greater than the max characters value", () => {
        // Arrange
        const testValue = "MyTestValue";
        const requiredEllipsis = ".......";
        expect(testValue.length).toEqual(11);
        const expectedValue = `${testValue.substring(0, 10)}${requiredEllipsis}`;

        // Act
        const result = ellipsisPipe.transform(testValue, 10, requiredEllipsis);

        // Assert
        expect(result).toEqual(expectedValue);
    });

    it("should NOT add an ellipsis when the length of the received value is lesser than the max characters value", () => {
        // Arrange
        const testValue = "MyTestVal";
        const requiredEllipsis = ".......";
        expect(testValue.length).toEqual(9);

        // Act
        const result = ellipsisPipe.transform(testValue, 10, requiredEllipsis);

        // Assert
        expect(result).toEqual(testValue);
    });

    it("should NOT add an ellipsis when the length of the received value is equal to the max characters value", () => {
        // Arrange
        const testValue = "MyTestValu";
        const requiredEllipsis = ".......";
        expect(testValue.length).toEqual(10);

        // Act
        const result = ellipsisPipe.transform(testValue, 10, requiredEllipsis);

        // Assert
        expect(result).toEqual(testValue);
    });

    it("should set a default ellipsis and a default max characters length if none are provided", () => {
        // Arrange
        const testValue = "MyTestValueMyTestValueMyTestValueMyTestValueMyTestValue";
        const defaultEllipsis = "...";
        expect(testValue.length).toEqual(55);
        const expectedValue = `${testValue.substring(0, 40)}${defaultEllipsis}`;

        // Act
        const result = ellipsisPipe.transform(testValue, 40, undefined);

        // Assert
        expect(result).toEqual(expectedValue);
    });

    it("should set a default ellipsis and a default max characters length if null is provided", () => {
        // Arrange
        const testValue = "MyTestValueMyTestValueMyTestValueMyTestValueMyTestValue";
        const defaultEllipsis = "...";
        expect(testValue.length).toEqual(55);
        const expectedValue = `${testValue.substring(0, 40)}${defaultEllipsis}`;

        // Act
        const result = ellipsisPipe.transform(testValue, 40, null);

        // Assert
        expect(result).toEqual(expectedValue);
    });
});
