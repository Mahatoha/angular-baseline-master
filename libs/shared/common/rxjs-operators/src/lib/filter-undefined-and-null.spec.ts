import { TestScheduler } from "rxjs/testing";

import { filterUndefinedAndNull } from "./filter-undefined-and-null";

describe("filterUndefinedAndNull operator", () => {
    let testScheduler: TestScheduler;

    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
    });

    it("should emit when the source observable value is neither undefined or null", () => {
        // Arrange
        testScheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;
            const values = { a: "Hello world" };
            const streamValue = cold("--a--|", values);
            const expected = "--a--|";

            // Act, Assert
            expectObservable(streamValue.pipe(filterUndefinedAndNull())).toBe(expected, values);
        });
    });

    it("should NOT emit when the source observable value is equal to undefined", () => {
        // Arrange
        testScheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;
            const values = { a: undefined };
            const streamValue = cold("--a--|", values);
            const expected = "-----|";

            // Act, Assert
            expectObservable(streamValue.pipe(filterUndefinedAndNull())).toBe(expected, values);
        });
    });
    it("should NOT emit when the source observable value is equal to null", () => {
        // Arrange
        testScheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;
            const values = { a: null };
            const streamValue = cold("--a--|", values);
            const expected = "-----|";

            // Act, Assert
            expectObservable(streamValue.pipe(filterUndefinedAndNull())).toBe(expected, values);
        });
    });
});
