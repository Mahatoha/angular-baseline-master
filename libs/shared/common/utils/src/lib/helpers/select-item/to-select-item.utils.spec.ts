import { toSelectItem, toSelectItems } from "./to-select-item.utils";

describe("toSelectItem()", () => {
    const option: TestType = {
        a: "test",
        b: 42,
        c: new Date(),
    };

    it("should return a SelectItem when item is an object and label property is a string", () => {
        // Arrange

        // Act
        const result = toSelectItem(option, "a");

        // Assert
        expect(result.label).toEqual(option.a);
        expect(result.value).toEqual(option);
    });

    it("should throw error when item is an object and label property is not a string", () => {
        // Arrange

        // Act, Assert
        expect(() => toSelectItem(option, "b")).toThrow(
            "Veuillez choisir une propriété de type string pour définir le label."
        );

        expect(() => toSelectItem(option, "c")).toThrow(
            "Veuillez choisir une propriété de type string pour définir le label."
        );
    });

    it("should throw error when item is an object and label property is not set", () => {
        // Arrange

        // Act, Assert
        expect(() => toSelectItem(option)).toThrow(
            "Veuillez choisir une propriété de type string pour définir le label."
        );
    });

    it("should throw error when item is not set", () => {
        // Arrange
        const otherOption: undefined = undefined;

        // Act, Assert
        expect(() => toSelectItem(otherOption)).toThrow(
            "Veuillez choisir une propriété de type string pour définir le label."
        );
    });

    it("should return a SelectItem when item is a string", () => {
        // Arrange
        const otherOption: string = "test";

        // Act
        const result = toSelectItem(otherOption);

        // Assert
        expect(result.label).toEqual(otherOption);
        expect(result.value).toEqual(otherOption);
    });

    it("should return a SelectItem when item is a number", () => {
        // Arrange
        const otherOption: number = 42;

        // Act
        const result = toSelectItem(otherOption);

        // Assert
        expect(result.label).toEqual("" + otherOption);
        expect(result.value).toEqual(otherOption);
    });

    it("should throw error when item is not an object, a string or a number", () => {
        // Arrange
        const otherOption: Date = new Date();

        // Act, Assert
        expect(() => toSelectItem(otherOption)).toThrow(
            "Veuillez choisir une propriété de type string pour définir le label."
        );
    });
});

describe("toSelectItems()", () => {
    const options: Array<TestType> = [
        {
            a: "test",
            b: 42,
            c: new Date(),
        },
        {
            a: "test2",
            b: 42,
            c: new Date(),
        },
        {
            a: "test3",
            b: 42,
            c: new Date(),
        },
    ];

    it("should return an array of SelectItem when items are objects and label property is a string", () => {
        // Arrange

        // Act
        const result = toSelectItems(options, "a");

        // Assert
        expect(result.length).toEqual(3);
        expect(result[0]?.label).toEqual(options[0]?.a);
        expect(result[0]?.value).toEqual(options[0]);
        expect(result[1]?.label).toEqual(options[1]?.a);
        expect(result[1]?.value).toEqual(options[1]);
        expect(result[2]?.label).toEqual(options[2]?.a);
        expect(result[2]?.value).toEqual(options[2]);
    });

    it("should return an empty array of SelectItem when items is empty", () => {
        // Arrange
        const otherOptions: Array<TestType> = [];

        // Act
        const result = toSelectItems(otherOptions, "a");

        // Assert
        expect(result.length).toEqual(0);
    });

    it("should throw error when item or label property is not valid", () => {
        // Arrange

        // Act, Assert
        expect(() => toSelectItems(options, "b")).toThrow(
            "Veuillez choisir une propriété de type string pour définir le label."
        );
    });
});

interface TestType {
    a: string;
    b: number;
    c: Date;
}
