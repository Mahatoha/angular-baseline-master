import { Component, DebugElement, ChangeDetectionStrategy } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { Select, SelectModule } from "@openng/optimus-ui/select";
import { MultiSelect, MultiSelectModule } from "@openng/optimus-ui/multiselect";

import { ToSelectItemsDirective } from "./to-select-item.directive";

describe("ToSelectItemsDirective", () => {
    describe("Valid use cases", () => {
        let fixture: ComponentFixture<TestHostComponent>;
        let component: TestHostComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TestHostComponent],
            }).compileComponents();

            fixture = TestBed.createComponent(TestHostComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it("should change dropdown options to SelectItems", () => {
            // Arrange
            const dropdownComponent: Select = fixture.debugElement.query(By.directive(Select)).componentInstance;

            // Assert
            expect(dropdownComponent.options?.length).toEqual(component.optionsValue.length);
            expect(dropdownComponent.options?.[0]?.label).toEqual(component.optionsValue[0]?.a);
            expect(dropdownComponent.options?.[0]?.value).toEqual(component.optionsValue[0]);
            expect(dropdownComponent.options?.[1]?.label).toEqual(component.optionsValue[1]?.a);
            expect(dropdownComponent.options?.[1]?.value).toEqual(component.optionsValue[1]);
            expect(dropdownComponent.options?.[2]?.label).toEqual(component.optionsValue[2]?.a);
            expect(dropdownComponent.options?.[2]?.value).toEqual(component.optionsValue[2]);
        });

        it("should change multi select options to SelectItems", () => {
            // Arrange
            const multiSelectComponent: MultiSelect = fixture.debugElement.query(
                By.directive(MultiSelect)
            ).componentInstance;

            // Assert
            expect(multiSelectComponent.options?.length).toEqual(component.optionsValue.length);
            expect(multiSelectComponent.options?.[0]?.label).toEqual(component.optionsValue[0]?.a);
            expect(multiSelectComponent.options?.[0]?.value).toEqual(component.optionsValue[0]);
            expect(multiSelectComponent.options?.[1]?.label).toEqual(component.optionsValue[1]?.a);
            expect(multiSelectComponent.options?.[1]?.value).toEqual(component.optionsValue[1]);
            expect(multiSelectComponent.options?.[2]?.label).toEqual(component.optionsValue[2]?.a);
            expect(multiSelectComponent.options?.[2]?.value).toEqual(component.optionsValue[2]);
        });
    });

    describe("Should throw case", () => {
        let fixture: ComponentFixture<TestHostSpanComponent>;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TestHostSpanComponent],
            }).compileComponents();

            fixture = TestBed.createComponent(TestHostSpanComponent);
            fixture.detectChanges();
        });

        it("should not instantiate directive when component is not a dropdown or a multiselect", () => {
            // Arrange
            const spanEl: DebugElement = fixture.debugElement.query(By.css(".test-span"));
            const directiveEl: DebugElement = fixture.debugElement.query(By.directive(ToSelectItemsDirective));

            // Assert
            expect(spanEl).toBeDefined();
            expect(directiveEl).toBeNull();
        });
    });
});

@Component({
    selector: "ga-test-host",
    template: `
        <p-select gaToSelectItems [options]="optionsValue" labelProperty="a" />
        <p-multiSelect gaToSelectItems [options]="optionsValue" labelProperty="a" />
    `,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [SelectModule, MultiSelectModule, ToSelectItemsDirective],
})
export class TestHostComponent {
    private _options: Array<TestType> = [
        {
            a: "test",
            b: 42,
            c: new Date(),
        },
        {
            a: "test2",
            b: 42,
            c: new Date(),
        },
        {
            a: "test3",
            b: 42,
            c: new Date(),
        },
    ];

    public set optionsValue(options: Array<TestType>) {
        this._options = options;
    }

    public get optionsValue(): Array<TestType> {
        return this._options;
    }
}

@Component({
    selector: "ga-test-host-span",
    template: ` <span gaToSelectItems class="test-span">test</span> `,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ToSelectItemsDirective],
})
export class TestHostSpanComponent {}

interface TestType {
    a: string;
    b: number;
    c: Date;
}
