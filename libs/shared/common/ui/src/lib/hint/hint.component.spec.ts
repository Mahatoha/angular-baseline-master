import { Component, DebugElement, ChangeDetectionStrategy } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

import { Tooltip } from "@openng/optimus-ui/tooltip";

import { HintComponent } from "./hint.component";

const DIRECTIVE_TEMPLATE: string = '<label class="test-label" [gaHint]="hintValue">{{ contentValue }}</label>';
const COMPONENT_TEMPLATE: string = '<abm-hint class="test-label" [gaHint]="hintValue">{{ contentValue }}</abm-hint>';

const DIRECTIVE_TEMPLATE_WITH_REF: string = `
    <label class="test-label" [gaHint]="myRef">{{ contentValue }}</label>
    <ng-template #myRef><h1>{{templateRefValue}}</h1></ng-template>
`;
const COMPONENT_TEMPLATE_WITH_REF: string = `
    <abm-hint class="test-label" [gaHint]="myRef">{{ contentValue }}</abm-hint>
    <ng-template #myRef><h1>{{templateRefValue}}</h1></ng-template>
`;

describe("HintComponent", () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let component: TestHostComponent;

    function beforeEach(templateToUse: string): void {
        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule, TestHostComponent],
        })
            .overrideComponent(TestHostComponent, {
                set: {
                    template: templateToUse,
                },
            })
            .compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
    }

    it.each([DIRECTIVE_TEMPLATE, COMPONENT_TEMPLATE])("should render the projected template", (templateToUse) => {
        // Arrange
        beforeEach(templateToUse);
        fixture.detectChanges();
        const testLabelEl: DebugElement = fixture.debugElement.query(By.css(".test-label"));
        const testDirectiveEl: DebugElement = fixture.debugElement.query(By.directive(HintComponent));

        // Assert
        expect(testLabelEl).not.toBeNull();
        expect(testDirectiveEl).not.toBeNull();
        expect(testLabelEl.nativeElement.textContent).toEqual(component.contentValue);
    });

    it.each([DIRECTIVE_TEMPLATE, COMPONENT_TEMPLATE])(
        "should only display a question mark icon on initialization",
        (templateToUse) => {
            // Arrange
            beforeEach(templateToUse);
            fixture.detectChanges();
            const hintIconEl: DebugElement = fixture.debugElement.query(By.css("i.pi.pi-question-circle"));
            const tooltip: Tooltip = fixture.debugElement.query(By.directive(Tooltip)).injector.get(Tooltip);

            // Assert
            expect(hintIconEl).not.toBeNull();
            expect(tooltip).toBeDefined();
        }
    );

    it.each([DIRECTIVE_TEMPLATE, COMPONENT_TEMPLATE])(
        "should display a correct hint value string on icon hover",
        (templateToUse) => {
            // Arrange
            beforeEach(templateToUse);
            fixture.detectChanges();
            const hintIconEl: DebugElement = fixture.debugElement.query(By.css("i.pi.pi-question-circle"));

            // Act
            hintIconEl.nativeElement.dispatchEvent(new Event("mouseenter"));
            const tooltip: Tooltip = fixture.debugElement.query(By.directive(Tooltip)).injector.get(Tooltip);

            // Assert
            expect(typeof tooltip.content).toEqual("string");
            expect(tooltip.content).toEqual(component.hintValue);
        }
    );

    it.each([DIRECTIVE_TEMPLATE_WITH_REF, COMPONENT_TEMPLATE_WITH_REF])(
        "should display a correct hint value using templateref on icon hover",
        (templateToUse) => {
            // Arrange
            beforeEach(templateToUse);
            fixture.detectChanges();
            const hintIconEl: DebugElement = fixture.debugElement.query(By.css("i.pi.pi-question-circle"));

            // Act
            hintIconEl.nativeElement.dispatchEvent(new Event("mouseenter"));
            const h1El: DebugElement = fixture.debugElement.query(By.directive(Tooltip)).query(By.css("h1"));

            // Assert
            expect(h1El).not.toBeNull();
            expect(h1El.nativeElement.textContent).toEqual(component.templateRefValue);
        }
    );
});

@Component({
    selector: "abm-test-component",
    template: "",
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [HintComponent],
})
export class TestHostComponent {
    private _hintValue: string = "Toto";

    private _contentValue: string = "Content";

    private _templateRefValue: string = "Template ref";

    public set hintValue(hint: string) {
        this._hintValue = hint;
    }

    public get hintValue(): string {
        return this._hintValue;
    }

    public set contentValue(content: string) {
        this._contentValue = content;
    }

    public get contentValue(): string {
        return this._contentValue;
    }

    public set templateRefValue(templateRefValue: string) {
        this._templateRefValue = templateRefValue;
    }

    public get templateRefValue(): string {
        return this._templateRefValue;
    }
}
