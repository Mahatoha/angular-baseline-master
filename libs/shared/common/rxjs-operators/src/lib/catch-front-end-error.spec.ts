import { TestScheduler } from "rxjs/testing";

import { catchFrontEndError, HandledError } from "./catch-front-end-error";

describe("catchFrontEndError operator", () => {
    const errorLog = jest.fn();
    let testScheduler: TestScheduler;

    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("should execute the error callback if the error was never handled", () => {
        // Arrange
        const initialError = new Error();
        testScheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;
            const errorStream = cold("--#--", {}, initialError);
            const expected = "--#--";

            // Act, Assert
            expectObservable(errorStream.pipe(catchFrontEndError(errorLog))).toBe(
                expected,
                undefined,
                expect.any(HandledError)
            );
        });

        // Assert
        expect(errorLog).toHaveBeenCalledTimes(1);
        expect(errorLog).toHaveBeenCalledWith(initialError);
    });

    it("should NOT execute the error callback if the source observable error was handled already", () => {
        // Arrange
        testScheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;
            const errorValue = new HandledError(new Error());
            const errorStream = cold("--#--", {}, errorValue);
            const expected = "--#--";

            // Act, Assert
            expectObservable(errorStream.pipe(catchFrontEndError(errorLog))).toBe(expected, undefined, errorValue);
        });

        // Assert
        expect(errorLog).not.toHaveBeenCalled();
    });

    it("should NOT throw any error when the stream does not error out", () => {
        // Arrange
        const streamValue = { a: "No error" };
        testScheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;
            const stream = cold("--a--|", streamValue);
            const expected = "--a--|";

            // Act, Assert
            expectObservable(stream.pipe(catchFrontEndError(errorLog))).toBe(expected, streamValue);
        });

        // Assert
        expect(errorLog).not.toHaveBeenCalled();
    });
});
