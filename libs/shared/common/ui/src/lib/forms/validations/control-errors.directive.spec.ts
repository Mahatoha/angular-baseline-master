import { Component, DebugElement, ChangeDetectionStrategy } from "@angular/core";
import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { By } from "@angular/platform-browser";

import { ErrorMessageComponent } from "./error-message/error-message.component";
import { ControlErrorsModule } from "./control-errors.module";

describe("ControlErrorsDirective", () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let component: TestHostComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
    });

    it("should add a specific class to the parent container on initialization", () => {
        // Arrange
        const parentContainerKlass: string = "error-message-container";
        const parentContainerEl: DebugElement = fixture.debugElement.query(By.css(".parent-container"));
        expect(parentContainerEl.nativeElement.className).not.toContain(parentContainerKlass);

        // Act
        fixture.detectChanges();

        // Assert
        expect(parentContainerEl.nativeElement.className).toContain(parentContainerKlass);
    });

    it("should NOT create an ErrorComponent if the binded control is in error on initialization", fakeAsync(() => {
        // Arrange
        component.testControl.setValue(null);
        expect(component.testControl.errors).not.toBeNull();

        // Act
        fixture.detectChanges();
        tick();
        const errorComponentEl: DebugElement = fixture.debugElement.query(By.css("abm-error-message"));

        // Assert
        expect(errorComponentEl).toBeNull();
    }));

    it("should create an ErrorComponent when the binded control is in error", fakeAsync(() => {
        // Arrange
        fixture.detectChanges();
        tick();

        expect(component.testControl.errors).toBeNull();
        const input: HTMLInputElement = fixture.debugElement.query(By.css("input")).nativeElement;

        // Act
        input.value = "abc";
        input.dispatchEvent(new Event("input"));
        const errorComponentEl: DebugElement = fixture.debugElement.query(By.directive(ErrorMessageComponent));

        // Assert
        expect(component.testControl.errors).not.toBeNull();
        expect(errorComponentEl).not.toBeNull();
    }));

    it("should remove the ErrorComponent if it exists as the binded control become valid", fakeAsync(() => {
        // Arrange
        fixture.detectChanges();
        tick();

        component.testControl.markAsDirty();
        component.testControl.setValue(null);

        const input: HTMLInputElement = fixture.debugElement.query(By.css("input")).nativeElement;
        let errorComponentEl: DebugElement = fixture.debugElement.query(By.directive(ErrorMessageComponent));
        expect(errorComponentEl).not.toBeNull();

        // Act
        input.value = "validInputValue";
        input.dispatchEvent(new Event("input"));
        errorComponentEl = fixture.debugElement.query(By.directive(ErrorMessageComponent));

        // Assert
        expect(errorComponentEl).toBeNull();
    }));

    it("should forward any custom error message received as input to the ErrorComponent", fakeAsync(() => {
        // Arrange
        fixture.detectChanges();
        tick();

        // Act
        component.testControl.markAsDirty();
        component.testControl.setValue(null);

        const errorComponent: ErrorMessageComponent = fixture.debugElement.query(
            By.directive(ErrorMessageComponent)
        ).componentInstance;

        // Assert
        expect(errorComponent.errorMessagesSnl()).toBe(component.customMessages);
    }));
});

@Component({
    selector: "abm-test-host",
    template: `<div class="parent-container">
        <input [formControl]="testControl" [customErrMessages]="customMessages" />
    </div>`,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ControlErrorsModule, ReactiveFormsModule],
})
export class TestHostComponent {
    public readonly testControl: FormControl = new FormControl("defaultValue", [
        Validators.required,
        Validators.minLength(4),
    ]);

    public customMessages = {
        required: () => "My custom required message",
        min: () => "My custom min message",
    };
}
