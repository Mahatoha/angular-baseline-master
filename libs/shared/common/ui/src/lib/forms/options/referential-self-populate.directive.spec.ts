import { Component, ChangeDetectionStrategy, Service } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

import { Select, SelectModule } from "@openng/optimus-ui/select";
import { MultiSelect, MultiSelectModule } from "@openng/optimus-ui/multiselect";
import { SelectButton, SelectButtonModule } from "@openng/optimus-ui/selectbutton";

import {
    REFERENTIAL_QUERY,
    ReferentialSelfPopulateDirective,
    Referentiels,
} from "./referential-self-populate.directive";
import { BehaviorSubject, map, Observable } from "rxjs";

interface Referentiel {
    code: string;
    libelle: string;
    ordre?: number;
}

enum FakeTypeCodeLibelle {
    Mock1 = "Mock1",
    Mock2 = "Mock2",
    Mock1Child = "Mock1Child",
}

const STORE_DEFAULT_VALUE: Referentiels = {
    [FakeTypeCodeLibelle.Mock1]: [
        { code: "Cmock1", libelle: "Cmock1" },
        {
            code: "Amock1",
            libelle: "Amock1",
        },
        {
            code: "Bmock1",
            libelle: "Bmock1",
        },
    ],
    [FakeTypeCodeLibelle.Mock2]: [
        { code: "Cmock2", libelle: "Cmock2" },
        {
            code: "Amock2",
            libelle: "Amock2",
        },
        {
            code: "Bmock2",
            libelle: "Bmock2",
        },
    ],
    [FakeTypeCodeLibelle.Mock1Child]: [
        { code: "Cmock1Child", libelle: "Cmock1Child" },
        {
            code: "Amock1Child",
            libelle: "Amock1Child",
        },
        {
            code: "Bmock1Child",
            libelle: "Bmock2Child",
        },
    ],
};

const filteredAmock1Child = ["Amock1Child"];
const filteredAmock2Child = ["Bmock1Child", "Cmock1Child"];

const fakeGetFilteredParentValue = (_pKey: string, parentCode: string, _refKey: string): Array<string> => {
    if (parentCode === "Amock1") {
        return filteredAmock1Child;
    } else if (parentCode === "Amock2") {
        return filteredAmock2Child;
    }

    return STORE_DEFAULT_VALUE[FakeTypeCodeLibelle.Mock1Child]?.map((v) => v.code) ?? [];
};

@Service({ autoProvided: false })
class ReferentialQueryMock {
    private readonly _storeSubject$ = new BehaviorSubject<Referentiels | null>(null);

    public set store(storeValue: Referentiels | null) {
        this._storeSubject$.next(storeValue);
    }

    public get store(): Referentiels | null {
        return this._storeSubject$.value;
    }

    public selectActiveReferentialByType(referentialType: string): Observable<Array<Referentiel>> {
        return this._storeSubject$.pipe(map((referentials) => referentials?.[referentialType] ?? []));
    }

    public getFileredParentValue?:
        ((parentKey: string, referentialCode: string, referentialKey: string) => Array<string>) | undefined;
}

describe("ReferentielSelfPopulateDirective", () => {
    describe("Should not init", () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DirectiveShouldThrowComponent],
                providers: [{ provide: REFERENTIAL_QUERY, useValue: {} }],
            }).compileComponents();
        });

        it("should not init if there is no valid component to populate", () => {
            // Act
            const fixture = TestBed.createComponent(DirectiveShouldThrowComponent);

            // Assert
            const directive = fixture.debugElement.query(By.directive(ReferentialSelfPopulateDirective));
            expect(directive).toBeNull();
        });
    });

    describe("Valid use cases", () => {
        const referentialQuery: ReferentialQueryMock = new ReferentialQueryMock();
        let fixture: ComponentFixture<TestHostComponent>;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TestHostComponent, NoopAnimationsModule],
                providers: [{ provide: REFERENTIAL_QUERY, useValue: referentialQuery }],
            }).compileComponents();

            fixture = TestBed.createComponent(TestHostComponent);
        });

        afterEach(() => {
            referentialQuery.store = null;
        });

        it("should populate the component options array on initialization based on the correct referential key", () => {
            // Arrange
            referentialQuery.store = STORE_DEFAULT_VALUE;

            const associatedKey = FakeTypeCodeLibelle.Mock1;
            const dropdown: Select = fixture.debugElement.query(By.css(".p-dropdown")).injector.get(Select);

            expect(dropdown.options).toBeNull();

            // Act
            fixture.detectChanges();
            const hasAllValues: boolean =
                STORE_DEFAULT_VALUE[associatedKey]?.every(
                    (referential) => dropdown.options?.findIndex((opt) => opt.value === referential.code) !== -1
                ) ?? false;

            // Assert
            expect(dropdown.options?.length).toEqual(STORE_DEFAULT_VALUE[associatedKey]?.length);
            expect(hasAllValues).toBe(true);
        });

        it("should work with either a p-select, a p-multiSelect or a p-selectButton", () => {
            // Arrange
            referentialQuery.store = STORE_DEFAULT_VALUE;

            const dropdown: Select = fixture.debugElement.query(By.css(".p-dropdown")).injector.get(Select);
            const multiSelect: MultiSelect = fixture.debugElement
                .query(By.css(".p-multiSelect"))
                .injector.get(MultiSelect);
            const selectButton: SelectButton = fixture.debugElement
                .query(By.css(".p-selectButton"))
                .injector.get(SelectButton);

            expect(dropdown.options).toBeNull();
            expect(multiSelect.options?.length).toBe(0);
            expect(selectButton.options).toBeUndefined();

            // Act
            fixture.detectChanges();

            // Assert
            expect(dropdown.options?.length).toEqual(STORE_DEFAULT_VALUE[FakeTypeCodeLibelle.Mock1]?.length);
            expect(multiSelect.options?.length).toEqual(STORE_DEFAULT_VALUE[FakeTypeCodeLibelle.Mock2]?.length);
            expect(selectButton.options?.length).toEqual(STORE_DEFAULT_VALUE[FakeTypeCodeLibelle.Mock1Child]?.length);
        });

        it("should order the referential list by item order if they are provided", () => {
            // Arrange
            const referentialTestKey = FakeTypeCodeLibelle.Mock1;

            referentialQuery.store = {
                [referentialTestKey]: [
                    {
                        code: "aMock",
                        libelle: "aMock",
                        ordre: 3,
                    },
                    { code: "bMock", libelle: "bMock", ordre: 1 },
                    { code: "cMock", libelle: "cMock", ordre: 2 },
                ],
            };

            const dropdown: Select = fixture.debugElement.query(By.css(".p-dropdown")).injector.get(Select);
            const expectedOptions = [...(referentialQuery.store[referentialTestKey] ?? [])]
                .sort((a, b) => (a.ordre as number) - (b.ordre as number))
                .map((i) => ({ label: i.libelle, value: i.code }));

            // Act
            fixture.detectChanges();

            // Assert
            expect(dropdown.options).toEqual(expectedOptions);
        });

        it("should order the referential list alphabetically if there is no order provided", () => {
            // Arrange
            referentialQuery.store = STORE_DEFAULT_VALUE;

            const referentialTestKey = FakeTypeCodeLibelle.Mock1;
            const dropdown: Select = fixture.debugElement.query(By.css(".p-dropdown")).injector.get(Select);
            const expectedOptions = [...(referentialQuery.store[referentialTestKey] ?? [])]
                .sort((a, b) => a.libelle.localeCompare(b.libelle))
                .map((i) => ({ label: i.libelle, value: i.code }));

            // Act
            fixture.detectChanges();

            // Assert
            expect(dropdown.options).toEqual(expectedOptions);
        });

        it("should be able to filter the referential list based on a specific parent-child relationship", () => {
            // Arrange
            referentialQuery.store = STORE_DEFAULT_VALUE;
            referentialQuery.getFileredParentValue = fakeGetFilteredParentValue;

            const referentialKey = FakeTypeCodeLibelle.Mock1Child;
            const dropdown = fixture.debugElement.query(By.css(".p-dropdown")).injector.get(Select);
            const selectButton = fixture.debugElement.query(By.css(".p-selectButton")).injector.get(SelectButton);

            fixture.detectChanges();

            const hasAllValues: boolean =
                STORE_DEFAULT_VALUE[referentialKey]?.every(
                    (referential) => selectButton.options?.findIndex((opt) => opt.value === referential.code) !== -1
                ) ?? false;
            expect(hasAllValues).toBe(true);

            // Act, Assert
            dropdown.writeValue("Amock1");
            fixture.detectChanges();

            let expectedChildOptions = STORE_DEFAULT_VALUE[referentialKey]
                ?.filter((c) => filteredAmock1Child.includes(c.code))
                .sort((a, b) => a.libelle.localeCompare(b.libelle))
                .map((opt) => ({ value: opt.code, label: opt.libelle }));

            expect(selectButton.options).toEqual(expectedChildOptions);

            // Act, Assert
            dropdown.writeValue("Amock2");
            fixture.detectChanges();

            expectedChildOptions = STORE_DEFAULT_VALUE[referentialKey]
                ?.filter((c) => filteredAmock2Child.includes(c.code))
                .sort((a, b) => a.libelle.localeCompare(b.libelle))
                .map((opt) => ({ value: opt.code, label: opt.libelle }));

            expect(selectButton.options).toEqual(expectedChildOptions);
        });
    });
});

@Component({
    selector: "abm-test-host",
    template: ` <p-select #parent class="p-dropdown" gaSelfPopulate [referentialKey]="TypeCodeLibelle.Mock1" />
        <p-multiSelect class="p-multiSelect" gaSelfPopulate [referentialKey]="TypeCodeLibelle.Mock2" />
        <p-selectButton
            class="p-selectButton"
            gaSelfPopulate
            [referentialKey]="TypeCodeLibelle.Mock1Child"
            [referentialTypeParent]="TypeCodeLibelle.Mock1"
            [referentialCodeParent]="parent.value"
        />`,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ReferentialSelfPopulateDirective, SelectModule, MultiSelectModule, SelectButtonModule],
})
class TestHostComponent {
    public TypeCodeLibelle: typeof FakeTypeCodeLibelle = FakeTypeCodeLibelle;
}

@Component({
    selector: "abm-should-throw",
    template: `<p gaSelfPopulate></p>`,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ReferentialSelfPopulateDirective],
})
class DirectiveShouldThrowComponent {}
