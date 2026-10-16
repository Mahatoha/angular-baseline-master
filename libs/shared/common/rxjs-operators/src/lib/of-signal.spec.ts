import { TestScheduler } from "rxjs/testing";

import { ofSignal } from "./of-signal";

describe("ofSignal operator", () => {
    const mockCb = jest.fn(() => void 0);
    let testScheduler: TestScheduler;

    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("should execute the provided callback and complete immediatly with no subsequent emission", () => {
        // Arrange
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;
            const expected = "|";

            // Act, Assert
            expectObservable(ofSignal(() => mockCb())).toBe(expected);
        });

        // Assert
        expect(mockCb).toHaveBeenCalledTimes(1);
    });
});
