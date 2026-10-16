import { TestBed } from "@angular/core/testing";
import { HumanizeReferentielPipe } from "./referential-humanizer.pipe";
import { REFERENTIAL_HUMANIZER } from "@gestion-acte/domain";

describe("ReferentialHumanizerPipe", () => {
    const fakeReferential: Record<string, string> = {
        testCode: "Toto",
        codeTest: "Tata",
    };

    const fakeHumanizerService = { humanizeReferential: (code: string) => fakeReferential[code] };
    let referentialHumanizerPipe: HumanizeReferentielPipe<unknown>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: REFERENTIAL_HUMANIZER,
                    useValue: fakeHumanizerService,
                },
                HumanizeReferentielPipe
            ],
        });
        referentialHumanizerPipe = TestBed.inject(HumanizeReferentielPipe);
    })

    it("should be able to humanize a referential code", () => {
        // Arrange
        const keyToHumanize = "codeTest";
        const randomType = "randomType";
        const expectedValue = fakeReferential[keyToHumanize];
        const humanizeReferentialSpy = jest.spyOn(fakeHumanizerService, "humanizeReferential");

        // Act
        const humanizedValue = referentialHumanizerPipe.transform(keyToHumanize, randomType);

        // Assert
        expect(humanizedValue).toEqual(expectedValue);
        expect(humanizeReferentialSpy).toHaveBeenCalledWith(keyToHumanize, randomType);
    });

    it("should return the received value if there is no humanizer fn available", () => {
        // Arrange
        const keyToHumanize = "unknownKey";
        const randomType = "randomType";
        const expectedValue = keyToHumanize;
        const humanizeReferentialSpy = jest.spyOn(fakeHumanizerService, "humanizeReferential");

        // Act
        const humanizedValue = referentialHumanizerPipe.transform(keyToHumanize, randomType);

        // Assert
        expect(humanizedValue).toEqual(expectedValue);
        expect(humanizeReferentialSpy).toHaveBeenCalledWith(keyToHumanize, randomType);
    });
});
