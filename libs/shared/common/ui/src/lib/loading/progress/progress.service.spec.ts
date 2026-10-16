import { of } from "rxjs";
import { TestScheduler } from "rxjs/testing";

import { ProgressService } from "./progress.service";
import * as ProgressUtils from "./progress.utils";

describe("ProgressService", () => {
    describe("longRunning()", () => {
        let progressService: ProgressService;
        let longRunningUtilsSpy: jest.SpyInstance;
        let handleSpy: jest.SpyInstance;

        beforeEach(() => {
            progressService = new ProgressService();
            longRunningUtilsSpy = jest.spyOn(ProgressUtils, "longRunning");
            handleSpy = jest.spyOn(progressService, "handle");
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        it("should call longRunning function from progress.utils.ts with default options", (done) => {
            // Arrange

            // Act
            of(of(1))
                .pipe(progressService.longRunning())
                .subscribe({
                    complete: () => {
                        // Assert
                        expect(longRunningUtilsSpy).toHaveBeenCalledTimes(1);
                        expect(longRunningUtilsSpy).toHaveBeenCalledWith({
                            progressHandler: expect.any(Function),
                        });
                        expect(handleSpy).toHaveBeenCalledTimes(1);
                        done();
                    },
                });
        });

        it("should call longRunning function from progress.utils.ts with given options and default progressHandler", (done) => {
            // Arrange
            const testFn = jest.fn();

            // Act
            of(of(1))
                .pipe(
                    progressService.longRunning({
                        parallel: true,
                        concurrent: 15,
                        progressHandler: (x) => {
                            testFn(x);
                        },
                    })
                )
                .subscribe({
                    complete: () => {
                        // Assert
                        expect(longRunningUtilsSpy).toHaveBeenCalledTimes(1);
                        expect(longRunningUtilsSpy).toHaveBeenCalledWith({
                            parallel: true,
                            concurrent: 15,
                            progressHandler: expect.any(Function),
                        });
                        expect(handleSpy).toHaveBeenCalledTimes(1);
                        expect(testFn).not.toHaveBeenCalled();
                        done();
                    },
                });
        });
    });

    describe("progress$ observable", () => {
        let progressService: ProgressService;
        let testScheduler: TestScheduler;

        beforeEach(() => {
            progressService = new ProgressService();
            testScheduler = new TestScheduler((actual, expected) => {
                expect(actual).toEqual(expected);
            });
        });

        it("should emit 0 1500ms after observable completion", () => {
            // Arrange
            testScheduler.run((helpers) => {
                const { cold, expectObservable } = helpers;
                const sourceObservable = cold("a 1s |", {
                    a: { current: 1, isOk: true, total: 1 },
                });
                const expectedMarbleDiagram = "a 2.5s b";
                const expectedValues = {
                    a: 100,
                    b: 0,
                };

                // Act
                progressService.handle(sourceObservable);

                // Assert
                expectObservable(progressService.progress$).toBe(expectedMarbleDiagram, expectedValues);
            });
        });

        it("should emit an eased progress value each 500ms after recieving a value until completion", () => {
            // Arrange
            testScheduler.run((helpers) => {
                const { cold, expectObservable } = helpers;
                const sourceObservable = cold("a 2.1s (b|)", {
                    a: { current: 0, isOk: true, total: 2 },
                    b: { current: 1, isOk: true, total: 2 },
                });
                const expectedMarbleDiagram = "500ms a 499ms b 499ms c 499ms d 100ms 500ms e 499ms f 499ms (gh)";
                const expectedValues = {
                    a: 0,
                    b: 22.5,
                    c: 33.75,
                    d: 39.375,
                    e: 50,
                    f: 72.5,
                    g: 83.75,
                    h: 0,
                };

                // Act
                progressService.handle(sourceObservable);

                // Assert
                expectObservable(progressService.progress$).toBe(expectedMarbleDiagram, expectedValues);
            });
        });

        it("should emit a progress value immediatly when current === total in recieved value from observable", () => {
            // Arrange
            testScheduler.run((helpers) => {
                const { cold, expectObservable } = helpers;
                const sourceObservable = cold("a 2.1s (b|)", {
                    a: { current: 0, isOk: true, total: 1 },
                    b: { current: 1, isOk: true, total: 1 },
                });
                const expectedMarbleDiagram = "500ms a 499ms b 499ms c 499ms d 100ms e 1499ms f";
                const expectedValues = {
                    a: 0,
                    b: 45,
                    c: 67.5,
                    d: 78.75,
                    e: 100,
                    f: 0,
                };

                // Act
                progressService.handle(sourceObservable);

                // Assert
                expectObservable(progressService.progress$).toBe(expectedMarbleDiagram, expectedValues);
            });
        });
    });

    describe("requestCount$ observable", () => {
        let progressService: ProgressService;
        let testScheduler: TestScheduler;

        beforeEach(() => {
            progressService = new ProgressService();
            testScheduler = new TestScheduler((actual, expected) => {
                expect(actual).toEqual(expected);
            });
        });

        it("should emit total from observable's value then 0 1500ms after observable completion", () => {
            // Arrange
            testScheduler.run((helpers) => {
                const { cold, expectObservable } = helpers;
                const sourceObservable = cold("a 1s |", {
                    a: { current: 1, isOk: true, total: 1 },
                });
                const expectedMarbleDiagram = "a 2.5s b";
                const expectedValues = {
                    a: 1,
                    b: 0,
                };

                // Act
                progressService.handle(sourceObservable);

                // Assert
                expectObservable(progressService.requestCount$).toBe(expectedMarbleDiagram, expectedValues);
            });
        });

        it("should emit distinct total from observable value", () => {
            // Arrange
            testScheduler.run((helpers) => {
                const { cold, expectObservable } = helpers;
                const sourceObservable = cold("a 2.1s b 999ms c 999ms |", {
                    a: { current: 0, isOk: true, total: 2 },
                    b: { current: 1, isOk: true, total: 2 },
                    c: { current: 2, isOk: true, total: 3 },
                });
                const expectedMarbleDiagram = "a 3.1s b 2.499s c";
                const expectedValues = {
                    a: 2,
                    b: 3,
                    c: 0,
                };

                // Act
                progressService.handle(sourceObservable);

                // Assert
                expectObservable(progressService.requestCount$).toBe(expectedMarbleDiagram, expectedValues);
            });
        });
    });
});
