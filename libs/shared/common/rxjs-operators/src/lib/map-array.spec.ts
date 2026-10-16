import { TestScheduler } from "rxjs/testing";

import { mapArray } from "./map-array";

describe("mapArray operator", () => {
    const mapTo0 = (_: unknown): number => 0;
    const mapperCb = jest.fn(mapTo0);
    let testScheduler: TestScheduler;

    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("should pass the provided callback on every entry of the source array", () => {
        // Arrange
        const sourceArray = ["Hello", "World", "Toto", "Tata"];
        testScheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;
            const expectedArray = sourceArray.map((i) => mapTo0(i));
            const values = { a: sourceArray, b: expectedArray };
            const streamValue = cold("--a--|", values);
            const expected = "--b--|";

            // Act, Assert
            expectObservable(streamValue.pipe(mapArray(mapperCb))).toBe(expected, values);
        });

        // Assert
        expect(mapperCb).toHaveBeenCalledTimes(sourceArray.length);
    });
});
