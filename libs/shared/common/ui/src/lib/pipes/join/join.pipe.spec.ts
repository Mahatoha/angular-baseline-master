import { JoinPipe } from "./join.pipe";

describe("JoinPipe", () => {
    const joinPipe = new JoinPipe();

    it("should join array elements with the default space separator", () => {
        // Arrange
        const testValue = ["MyTestValue", 1, "test"];
        const expectedValue = `${testValue[0]} ${testValue[1]} ${testValue[2]}`;

        // Act
        const result = joinPipe.transform(testValue);

        // Assert
        expect(result).toEqual(expectedValue);
    });

    it("should join array elements with the given separator", () => {
        // Arrange
        const testValue = ["MyTestValue", 1, "test"];
        const separator = "#";
        const expectedValue = `${testValue[0]}${separator}${testValue[1]}${separator}${testValue[2]}`;

        // Act
        const result = joinPipe.transform(testValue, separator);

        // Assert
        expect(result).toEqual(expectedValue);
    });

    it("should join array elements and filter undefined, null and empty elements", () => {
        // Arrange
        const testValue = ["MyTestValue", 1, undefined, null, "", "test"];
        const expectedValue = `${testValue[0]} ${testValue[1]} ${testValue[5]}`;

        // Act
        const result = joinPipe.transform(testValue);

        // Assert
        expect(result).toEqual(expectedValue);
    });
});
