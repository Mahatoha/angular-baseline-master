import { TestScheduler } from "rxjs/testing";

import { distinctUntilChangedJson } from "./distinct-until-changed-json";

describe("distinctUntilChangedJson operator", () => {
    let testScheduler: TestScheduler;

    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
    });

    it("should emit if the previous source emission as JSON is different to the current emission as JSON", () => {
        // Arrange
        testScheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;
            const previousSourceValue = { hello: "world", toto: "tata" };
            const values = { a: previousSourceValue, b: { tata: "toto" } };
            const streamValue = cold("--a--b--|", values);
            const expected = "--a--b--|";

            // Act, Assert
            expectObservable(streamValue.pipe(distinctUntilChangedJson())).toBe(expected, values);
        });
    });

    it("should NOT emit if the previous source emission as JSON is equal to the current emission as JSON", () => {
        // Arrange
        testScheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;
            const previousSourceValue = { hello: "world", toto: "tata" };
            const newValue = { hello: "world", toto: "tata" };
            const values = { a: previousSourceValue, b: newValue };
            const streamValue = cold("--a--b--|", values);
            const expected = "--a-----|";

            // Act, Assert
            expectObservable(streamValue.pipe(distinctUntilChangedJson())).toBe(expected, values);
        });
    });
});
