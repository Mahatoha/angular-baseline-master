import { TestScheduler } from "rxjs/testing";

import { filterUndefined } from "./filter-undefined";

describe("filterUndefined operator", () => {
    let testScheduler: TestScheduler;

    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
    });
    it("should emit when the source observable has a defined value", () => {
        // Arrange
        testScheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;
            const values = { a: "Hello world" };
            const streamValue = cold("--a--|", values);
            const expected = "--a--|";

            // Act, Assert
            expectObservable(streamValue.pipe(filterUndefined())).toBe(expected, values);
        });
    });
    it("should emit when the source observable has a falsy value which is not undefined", () => {
        // Arrange
        testScheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;
            const values = { a: null };
            const streamValue = cold("--a--|", values);
            const expected = "--a--|";

            // Act, Assert
            expectObservable(streamValue.pipe(filterUndefined())).toBe(expected, values);
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
            expectObservable(streamValue.pipe(filterUndefined())).toBe(expected, values);
        });
    });
});
