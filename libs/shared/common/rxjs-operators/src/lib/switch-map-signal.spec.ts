import { TestScheduler } from "rxjs/testing";

import { switchMapSignal } from "./switch-map-signal";

describe("switchMapSignal operator", () => {
    const mockCb = jest.fn(() => 0);
    let testScheduler: TestScheduler;

    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("should execute the provided callback but only passes call of COMPLETE with no subsequent emission", () => {
        // Arrange
        testScheduler.run((helpers) => {
            const { hot, expectObservable } = helpers;
            const streamValue = hot("--a--|");
            const expected = "-----|";

            // Act, Assert
            expectObservable(streamValue.pipe(switchMapSignal(() => mockCb()))).toBe(expected);
        });

        // Assert
        expect(mockCb).toHaveBeenCalledTimes(1);
    });

    it("should NOT execute the provided callback but only passes call of ERROR when the source error out", () => {
        // Arrange
        testScheduler.run((helpers) => {
            const { hot, expectObservable } = helpers;
            const streamValue = hot("--#--");
            const expected = "--#--";

            // Act, Assert
            expectObservable(streamValue.pipe(switchMapSignal(() => mockCb()))).toBe(expected);
        });
    });
});
