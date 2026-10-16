import { Orderable, sortOrderables } from "./index";

describe("sortOrderables()", () => {
    it("should return negative value when a.order < b.order", () => {
        // Arrange
        const a: Orderable = { order: 1 };

        const b: Orderable = { order: 2 };

        // Act
        const result: number = sortOrderables(a, b);

        // Assert
        expect(result).toBeLessThan(0);
    });

    it("should return positive value when a.order < b.order", () => {
        // Arrange
        const a: Orderable = { order: 2 };

        const b: Orderable = { order: 1 };

        // Act
        const result: number = sortOrderables(a, b);

        // Assert
        expect(result).toBeGreaterThan(0);
    });

    it("should return zero when a.order = b.order", () => {
        // Arrange
        const a: Orderable = { order: 1 };

        const b: Orderable = { order: 1 };

        // Act
        const result: number = sortOrderables(a, b);

        // Assert
        expect(result).toEqual(0);
    });

    it("should return positive value when a.order is not defined", () => {
        // Arrange
        const a: Orderable = { order: undefined };

        const b: Orderable = { order: 1 };

        // Act
        const result: number = sortOrderables(a, b);

        // Assert
        expect(result).toBeGreaterThan(0);
    });

    it("should return negative value when b.order is not defined", () => {
        // Arrange
        const a: Orderable = { order: 1 };

        const b: Orderable = {
            //
        };

        // Act
        const result: number = sortOrderables(a, b);

        // Assert
        expect(result).toBeLessThan(0);
    });

    it("should return zero when a.order and b.order are not defined", () => {
        // Arrange
        const a: Orderable = { order: null };

        const b: Orderable = {
            //
        };

        // Act
        const result: number = sortOrderables(a, b);

        // Assert
        expect(result).toEqual(0);
    });
});
