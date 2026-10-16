import { TestBed } from "@angular/core/testing";
import { ParamsHumanizerPipe } from "./params-humanizer.pipe";
import { PARAMS_HUMANIZER } from "@gestion-acte/domain";

describe("ParamsHumanizerPipe", () => {
    let paramsHumanizerPipe: ParamsHumanizerPipe | null;

    afterEach(() => {
        paramsHumanizerPipe = null;
    });

    it("should try to humanize the received value based on the provided humanizer function", () => {
        // Arrange
        const receivedValue = "Toto";
        const expectedValue = "Tata";
        
        TestBed.configureTestingModule({
            providers: [
                ParamsHumanizerPipe
            ],
        });
        paramsHumanizerPipe = TestBed.inject(ParamsHumanizerPipe);

        // Act
        const humanizedValue = paramsHumanizerPipe.transform(receivedValue, () => expectedValue);

        // Assert
        expect(humanizedValue).toEqual(expectedValue);
    });

    it("should try to humanize the received value based on the param key and the injected humanizer if there is no humanizerFn", () => {
        // Arrange
        const expectedValue = "Tata";
        const receivedValue = "Toto";
        const paramKey = "randomEntityId";

        TestBed.configureTestingModule({
            providers: [
                {
                    provide: PARAMS_HUMANIZER,
                    useValue: { humanizerMap: new Map([[paramKey, () => expectedValue]]) },
                },
                ParamsHumanizerPipe
            ],
        });
        paramsHumanizerPipe = TestBed.inject(ParamsHumanizerPipe);

        // Act
        const humanizedValue = paramsHumanizerPipe.transform(receivedValue, paramKey);

        // Assert
        expect(humanizedValue).toEqual(expectedValue);
    });

    it("should use the provided humanizer fn even if there are injected humanizers", () => {
        // Arrange
        const paramsHumanizerValue = "Tata";
        const receivedValue = "Toto";
        const expectedValue = "Coucou";

        const paramKey = "randomEntityId";

        TestBed.configureTestingModule({
            providers: [
                {
                    provide: PARAMS_HUMANIZER,
                    useValue: {
                        humanizerMap: new Map([[paramKey, () => paramsHumanizerValue]]),
                    },
                },
                ParamsHumanizerPipe
            ],
        });
        paramsHumanizerPipe = TestBed.inject(ParamsHumanizerPipe);

        // Act
        const humanizedValue = paramsHumanizerPipe.transform(receivedValue, () => expectedValue);

        // Assert
        expect(humanizedValue).not.toEqual(paramsHumanizerValue);
        expect(humanizedValue).toEqual(expectedValue);
    });

    it("should return the received value if there is no humanizer fn in either the parameters or the injections", () => {
        // Arrange
        const paramsHumanizerValue = "Tata";
        const receivedValue = "Toto";
        const paramKey = "randomEntityId";

        TestBed.configureTestingModule({
            providers: [
                {
                    provide: PARAMS_HUMANIZER,
                    useValue: {
                        humanizerMap: new Map([[paramKey, () => paramsHumanizerValue]]),
                    },
                },
                ParamsHumanizerPipe
            ],
        });
        paramsHumanizerPipe = TestBed.inject(ParamsHumanizerPipe);

        // Act
        const humanizedValue = paramsHumanizerPipe.transform(receivedValue, "unknownParentKey");

        // Assert
        expect(humanizedValue).toEqual(receivedValue);
    });
});
