import { TestScheduler } from "rxjs/testing";

import { notifyState } from "./notify-state";

describe("notifyState operator", () => {
    const mockStateHandler = jest.fn();
    let testScheduler: TestScheduler;

    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("should execute the provided handler with false when the source COMPLETE", () => {
        // Arrange
        testScheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;
            const streamValue = cold("-----|");
            const expected = "-----|";

            // Act, Assert
            expectObservable(streamValue.pipe(notifyState(mockStateHandler))).toBe(expected);
        });

        // Assert
        expect(mockStateHandler).toHaveBeenCalledWith(false);
    });

    it("should execute the provided handler with false when the source ERROR out", () => {
        // Arrange
        testScheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;
            const streamValue = cold("--#--");
            const expected = "--#--";

            // Act, Assert
            expectObservable(streamValue.pipe(notifyState(mockStateHandler))).toBe(expected);
        });

        // Assert
        expect(mockStateHandler).toHaveBeenCalledWith(false);
    });

    it("should execute the provided handler with true as a value and execute it again with false as a value in correct order", () => {
        // Arrange
        testScheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;
            const streamValue = cold("--a--|");
            const expected = "--a--|";

            // Act, Assert
            expectObservable(streamValue.pipe(notifyState(mockStateHandler))).toBe(expected);
        });

        // Assert
        expect(mockStateHandler).toHaveBeenNthCalledWith(1, true);
        expect(mockStateHandler).toHaveBeenNthCalledWith(2, false);
    });

    it("should NOT modify the initial source value", () => {
        // Arrange
        const sourceValue = { a: "Original Source Value" };
        testScheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;
            const streamValue = cold("--a--|", sourceValue);
            const expected = "--a--|";

            // Act, Assert
            expectObservable(streamValue.pipe(notifyState(mockStateHandler))).toBe(expected, sourceValue);
        });
    });
});
