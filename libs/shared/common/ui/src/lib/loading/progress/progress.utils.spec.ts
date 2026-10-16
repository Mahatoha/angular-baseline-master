import { Observable, ReplaySubject, Subject, from, of, switchMap } from "rxjs";
import { TestScheduler } from "rxjs/testing";

import {
    computeEasedValue,
    ease,
    longRunning,
    LongRunningProgressState,
} from "./progress.utils";

describe("longRunning operator", () => {
    let testScheduler: TestScheduler;
    let testSubject: Subject<Observable<LongRunningProgressState>>;

    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
        testSubject = new ReplaySubject();
    });

    afterEach(() => {
        testSubject.complete();
    });

    it("should emit a LongRunningProgressState at start and completion of source observable", () => {
        // Arrange
        testScheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;
            const sourceObservable = cold("--|");
            const expectedSourceObservable = "--|";
            const expectedLongRunning = "a-b";
            const expectedLongRunningValues = {
                a: { current: 0, isOk: true, total: 1 },
                b: { current: 1, isOk: true, total: 1 },
            };

            // Act, Assert
            expectObservable(
                of(sourceObservable).pipe(longRunning({ progressHandler: (x) => testSubject.next(x) }))
            ).toBe(expectedSourceObservable);

            expectObservable(testSubject.asObservable().pipe(switchMap((x) => x))).toBe(
                expectedLongRunning,
                expectedLongRunningValues
            );
        });
    });

    it("should emit a LongRunningProgressState at start of first source observable and at completion of all source observables when not configured to make parallel runs", () => {
        // Arrange
        testScheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;
            const sourceObservable = cold("--|");
            const expectedSourceObservables = "----|";
            const expectedLongRunning = "a-b-c";
            const expectedLongRunningValues = {
                a: { current: 0, isOk: true, total: 2 },
                b: { current: 1, isOk: true, total: 2 },
                c: { current: 2, isOk: true, total: 2 },
            };

            // Act, Assert
            expectObservable(
                from([sourceObservable, sourceObservable]).pipe(
                    longRunning({ progressHandler: (x) => testSubject.next(x) })
                )
            ).toBe(expectedSourceObservables);

            expectObservable(testSubject.asObservable().pipe(switchMap((x) => x))).toBe(
                expectedLongRunning,
                expectedLongRunningValues
            );
        });
    });

    it("should run observable in parallel when configured to do so and emit LongRunningProgressState accordingly", () => {
        // Arrange
        testScheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;
            const sourceObservable = cold("--|");
            const expectedSourceObservables = "--|";
            const expectedLongRunning = "a-(bc)";
            const expectedLongRunningValues = {
                a: { current: 0, isOk: true, total: 2 },
                b: { current: 1, isOk: true, total: 2 },
                c: { current: 2, isOk: true, total: 2 },
            };

            // Act, Assert
            expectObservable(
                from([sourceObservable, sourceObservable]).pipe(
                    longRunning({ parallel: true, concurrent: 2, progressHandler: (x) => testSubject.next(x) })
                )
            ).toBe(expectedSourceObservables);

            expectObservable(testSubject.asObservable().pipe(switchMap((x) => x))).toBe(
                expectedLongRunning,
                expectedLongRunningValues
            );
        });
    });

    it("should run 2 observables in parallel when configured to do so and wait for an observable to end before running a new one", () => {
        // Arrange
        testScheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;
            const sourceObservable1 = cold("--|");
            const sourceObservable2 = cold("----|");
            const expectedSourceObservables = "------|";
            // Grouping elements using parentheses will virtualy consume frames (one for each character in the group, parentheses included), so values must be delayed in next observables' marble diagram.
            // See: https://rxjs.dev/guide/testing/marble-testing#marble-syntax
            const expectedLongRunning = "a-(bc)d";
            const expectedLongRunningValues = {
                a: { current: 0, isOk: true, total: 3 },
                b: { current: 1, isOk: true, total: 3 },
                c: { current: 2, isOk: true, total: 3 },
                d: { current: 3, isOk: true, total: 3 },
            };

            // Act, Assert
            expectObservable(
                from([sourceObservable1, sourceObservable1, sourceObservable2]).pipe(
                    longRunning({ parallel: true, concurrent: 2, progressHandler: (x) => testSubject.next(x) })
                )
            ).toBe(expectedSourceObservables);

            expectObservable(testSubject.asObservable().pipe(switchMap((x) => x))).toBe(
                expectedLongRunning,
                expectedLongRunningValues
            );
        });
    });

    it("should stop when a source observable throw an error and continueOnError parameter is set to false", () => {
        // Arrange
        testScheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;
            const sourceObservable1 = cold("--|");
            const sourceObservable2 = cold("--#");
            const expectedSourceObservables = "----#";
            const expectedLongRunning = "a-b-c";
            const expectedLongRunningValues = {
                a: { current: 0, isOk: true, total: 3 },
                b: { current: 1, isOk: true, total: 3 },
                c: { current: 1, isOk: false, total: 3 },
            };

            // Act, Assert
            expectObservable(
                from([sourceObservable1, sourceObservable2, sourceObservable1]).pipe(
                    longRunning({ progressHandler: (x) => testSubject.next(x) })
                )
            ).toBe(expectedSourceObservables);

            expectObservable(testSubject.asObservable().pipe(switchMap((x) => x))).toBe(
                expectedLongRunning,
                expectedLongRunningValues
            );
        });
    });

    it("should continue when a source observable throw an error and continueOnError parameter is set to true and emit LongRunningProgressState as if there is no error", () => {
        // Arrange
        testScheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;
            const sourceObservable1 = cold("--|");
            const sourceObservable2 = cold("--#");
            const expectedSourceObservables = "------|";
            const expectedLongRunning = "a-b-c-d";
            const expectedLongRunningValues = {
                a: { current: 0, isOk: true, total: 3 },
                b: { current: 1, isOk: true, total: 3 },
                c: { current: 2, isOk: true, total: 3 },
                d: { current: 3, isOk: true, total: 3 },
            };

            // Act, Assert
            expectObservable(
                from([sourceObservable1, sourceObservable2, sourceObservable1]).pipe(
                    longRunning({ continueOnError: true, progressHandler: (x) => testSubject.next(x) })
                )
            ).toBe(expectedSourceObservables);

            expectObservable(testSubject.asObservable().pipe(switchMap((x) => x))).toBe(
                expectedLongRunning,
                expectedLongRunningValues
            );
        });
    });

    it("should stop when a source observable throw an error and continueOnError parameter is set to false while configured to use parallel run", () => {
        // Arrange
        testScheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;
            const sourceObservable1 = cold("--|");
            const sourceObservable2 = cold("--#");
            const expectedSourceObservables = "--#";
            const expectedLongRunning = "a-(bc)";
            const expectedLongRunningValues = {
                a: { current: 0, isOk: true, total: 3 },
                b: { current: 1, isOk: true, total: 3 },
                c: { current: 1, isOk: false, total: 3 },
            };

            // Act, Assert
            expectObservable(
                from([sourceObservable1, sourceObservable2, sourceObservable1]).pipe(
                    longRunning({ parallel: true, concurrent: 2, progressHandler: (x) => testSubject.next(x) })
                )
            ).toBe(expectedSourceObservables);

            expectObservable(testSubject.asObservable().pipe(switchMap((x) => x))).toBe(
                expectedLongRunning,
                expectedLongRunningValues
            );
        });
    });

    it("should continue when a source observable throw an error and continueOnError parameter is set to true and emit LongRunningProgressState as if there is no error while configured to use parallel run", () => {
        // Arrange
        testScheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;
            const sourceObservable1 = cold("--|");
            const sourceObservable2 = cold("--#");
            const sourceObservable3 = cold("----|");
            const expectedSourceObservables = "------|";
            // Grouping elements using parentheses will virtualy consume frames (one for each character in the group, parentheses included), so values must be delayed in next observables' marble diagram.
            // See: https://rxjs.dev/guide/testing/marble-testing#marble-syntax
            const expectedLongRunning = "a-(bc)d";
            const expectedLongRunningValues = {
                a: { current: 0, isOk: true, total: 3 },
                b: { current: 1, isOk: true, total: 3 },
                c: { current: 2, isOk: true, total: 3 },
                d: { current: 3, isOk: true, total: 3 },
            };

            // Act, Assert
            expectObservable(
                from([sourceObservable1, sourceObservable2, sourceObservable3]).pipe(
                    longRunning({
                        continueOnError: true,
                        parallel: true,
                        concurrent: 2,
                        progressHandler: (x) => testSubject.next(x),
                    })
                )
            ).toBe(expectedSourceObservables);

            expectObservable(testSubject.asObservable().pipe(switchMap((x) => x))).toBe(
                expectedLongRunning,
                expectedLongRunningValues
            );
        });
    });
});

describe("computeEasedValue()", () => {
    it.each([
        { currentStep: 0, result: 0 },
        { currentStep: 1, result: 45 },
        { currentStep: 2, result: 67.5 },
        { currentStep: 3, result: 78.75 },
        { currentStep: 4, result: 84.375 },
        { currentStep: 5, result: 87.1875 },
        { currentStep: 6, result: 88.59375 },
        { currentStep: 7, result: 89.296875 },
        { currentStep: 8, result: 89.6484375 },
        { currentStep: 9, result: 89.82421875 },
        { currentStep: 10, result: 89.912109375 },
    ])("should compute the correct eased value for step $currentStep", ({ currentStep, result }) => {
        // Act, Assert
        expect(computeEasedValue(0, 100, 10, currentStep)).toBeCloseTo(result);
    });
});

describe("ease operator", () => {
    let testScheduler: TestScheduler;

    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual.length).toEqual(expected.length);
            (actual as Array<any>).forEach((element, i) => {
                expect(element.frame).toEqual(expected[i].frame);
                expect(element.notification.kind).toEqual(expected[i].notification.kind);
            });
        });
    });

    it.each([
        { duration: 2, period: 1, expectedMarbleDiagram: "-aa(a|)" },
        { duration: 10, period: 1, expectedMarbleDiagram: "-aaaaaaaaaa(a|)" },
        { duration: 600, period: 300, expectedMarbleDiagram: "300ms a 299ms a 299ms (a|)" },
        {
            duration: undefined,
            period: undefined,
            expectedMarbleDiagram:
                "500ms a 499ms a 499ms a 499ms a 499ms a 499ms a 499ms a 499ms a 499ms a 499ms a 499ms (a|)",
        },
    ])(
        "should emit the right number of values at correct interval for duration = $duration and period = $period",
        ({ duration, period, expectedMarbleDiagram }) => {
            // Arrange
            testScheduler.run((helpers) => {
                const { cold, expectObservable } = helpers;
                const sourceObservable = cold("a|", { a: { current: 0, next: 100 } });

                // Act, Assert
                expectObservable(sourceObservable.pipe(ease(duration, period))).toBe(expectedMarbleDiagram);
            });
        }
    );

    it("should emit only the current value once when current and next values are the same", () => {
        // Arrange
        new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        }).run((helpers) => {
            const { cold, expectObservable } = helpers;
            const sourceObservable = cold("a|", { a: { current: 42, next: 42 } });
            const expectedMarbleDiagram = "a|";
            const expectedValue = { a: 42 };

            // Act, Assert
            expectObservable(sourceObservable.pipe(ease())).toBe(expectedMarbleDiagram, expectedValue);
        });
    });
});
