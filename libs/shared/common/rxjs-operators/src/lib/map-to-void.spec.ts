import { TestScheduler } from "rxjs/testing";

import { mapToVoid } from "./map-to-void";

describe("mapToVoid operator", () => {
    let testScheduler: TestScheduler;

    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
    });

    it("should modify the return value of any source observable to void", () => {
        // Arrange
        testScheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;
            const values = { a: "Hello world", b: void 0 };
            const streamValue = cold("--a--|", values);
            const expected = "--b--|";

            // Act, Assert
            expectObservable(streamValue.pipe(mapToVoid())).toBe(expected, values);
        });
    });
});
