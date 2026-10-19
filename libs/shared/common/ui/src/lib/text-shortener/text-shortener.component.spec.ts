import { Component, DebugElement, ChangeDetectionStrategy } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

import { Tooltip } from "@openng/optimus-ui/tooltip";

import { TextShortenerComponent } from "./text-shortener.component";

describe("TextShortenerComponent", () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let component: TestHostComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule, TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
    });

    it("Should display provided label without ellipsis when text is shorter than the default max length", () => {
        // Arrange
        component.labelValue = "The text to keep";
        const spanEl: DebugElement = fixture.debugElement.query(By.css("#label-only>span"));

        // Act
        fixture.detectChanges();

        // Assert
        expect(spanEl.nativeElement.textContent.trim()).toEqual(component.labelValue);
    });

    it("Should display provided label without ellipsis when text is shorter than the provided max length", () => {
        // Arrange
        component.labelValue = "The very very very very very very very long text to keep";
        component.maxLengthValue = 60;
        const spanEl: DebugElement = fixture.debugElement.query(By.css("#label-and-max-length>span"));

        // Act
        fixture.detectChanges();

        // Assert
        expect(spanEl.nativeElement.textContent.trim()).toEqual(component.labelValue);
    });

    it("Should not display tooltip when text is shorter than the default max length", () => {
        // Arrange
        component.labelValue = "The text to keep";
        const spanEl: DebugElement = fixture.debugElement.query(By.css("#label-only>span"));

        // Act
        fixture.detectChanges();
        spanEl.nativeElement.dispatchEvent(new Event("mouseenter"));
        const tooltip: Tooltip = spanEl.injector.get(Tooltip);

        // Assert
        expect(tooltip.disabled).toBe(true);
        expect(tooltip.container).toBe(null);
    });

    it("Should not display tooltip when text is shorter than the provided max length", () => {
        // Arrange
        component.labelValue = "The very very very very very very very long text to keep";
        component.maxLengthValue = 60;
        const spanEl: DebugElement = fixture.debugElement.query(By.css("#label-and-max-length>span"));

        // Act
        fixture.detectChanges();
        spanEl.nativeElement.dispatchEvent(new Event("mouseenter"));
        const tooltip: Tooltip = spanEl.injector.get(Tooltip);

        // Assert
        expect(tooltip.disabled).toBe(true);
        expect(tooltip.container).toBe(null);
    });

    it("Should display shortened label with ellipsis when text is longer than the default max length", () => {
        // Arrange
        component.labelValue = "The very very very very very very very long text to shorten";
        const spanEl: DebugElement = fixture.debugElement.query(By.css("#label-only>span"));
        const expectedLabel: string = "The very very very very very very very long text t...";

        // Act
        fixture.detectChanges();

        // Assert
        expect(spanEl.nativeElement.textContent.trim()).toEqual(expectedLabel);
    });

    it("Should display shortened label with ellipsis when text is longer than the provided max length", () => {
        // Arrange
        component.labelValue = "The very long text to shorten";
        component.maxLengthValue = 5;
        const spanEl: DebugElement = fixture.debugElement.query(By.css("#label-and-max-length>span"));
        const expectedLabel: string = "The v...";

        // Act
        fixture.detectChanges();

        // Assert
        expect(spanEl.nativeElement.textContent.trim()).toEqual(expectedLabel);
    });

    it("Should display tooltip when text is longer than the default max length", () => {
        // Arrange
        component.labelValue = "The very very very very very very very long text to shorten";
        const spanEl: DebugElement = fixture.debugElement.query(By.css("#label-only>span"));

        // Act
        fixture.detectChanges();
        spanEl.nativeElement.dispatchEvent(new Event("mouseenter"));
        const tooltip: Tooltip = spanEl.injector.get(Tooltip);

        // Assert
        expect(tooltip.disabled).toBe(false);
        expect(tooltip.container).not.toBe(null);
        expect(tooltip.content).toBe(component.labelValue);
    });

    it("Should display tooltip when text is longer than the provided max length", () => {
        // Arrange
        component.labelValue = "The very long text to shorten";
        component.maxLengthValue = 5;
        const spanEl: DebugElement = fixture.debugElement.query(By.css("#label-and-max-length>span"));

        // Act
        fixture.detectChanges();
        spanEl.nativeElement.dispatchEvent(new Event("mouseenter"));
        const tooltip: Tooltip = spanEl.injector.get(Tooltip);

        // Assert
        expect(tooltip.disabled).toBe(false);
        expect(tooltip.container).not.toBe(null);
        expect(tooltip.content).toBe(component.labelValue);
    });
});

@Component({
    selector: "abm-test-component",
    template: `
        <abm-text-shortener id="label-only" [label]="labelValue" />
        <abm-text-shortener id="label-and-max-length" [label]="labelValue" [maxLength]="maxLengthValue" />
    `,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TextShortenerComponent],
})
export class TestHostComponent {
    public _labelValue: string = "";

    public _maxLengthValue: number = 40;

    public set labelValue(label: string) {
        this._labelValue = label;
    }

    public get labelValue(): string {
        return this._labelValue;
    }

    public set maxLengthValue(maxLength: number) {
        this._maxLengthValue = maxLength;
    }

    public get maxLengthValue(): number {
        return this._maxLengthValue;
    }
}
