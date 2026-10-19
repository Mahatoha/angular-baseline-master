import { Component, DebugElement, ChangeDetectionStrategy } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { HoverScaleDirective } from "./hover-scale.directive";
import { DEFAULT_SCALING_RATIO } from "../common/transformations.const";

describe("HoverScaleDirective", () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let component: TestHostComponent;

    const setupScaling = (className: string): DebugElement => {
        fixture.detectChanges();

        const divEl: DebugElement = fixture.debugElement.query(By.css(className));
        const styles = getComputedStyle(divEl.nativeElement);
        expect(styles.transform).toEqual("");

        // Act
        divEl.nativeElement.dispatchEvent(new Event("mouseenter"));

        return divEl;
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
    });

    it("should apply a default scaling ratio on the parent element on hover", () => {
        // Arrange, Act
        const defaultRatioDivEl = setupScaling(".no-ratio");
        const styles = getComputedStyle(defaultRatioDivEl.nativeElement);

        // Assert
        expect(styles.transform).toEqual(`scale(${DEFAULT_SCALING_RATIO})`);
    });

    it("should properly remove any scaling ratio on the parent element on mouse leave", () => {
        // Arrange
        const defaultRatioDivEl = setupScaling(".no-ratio");
        let styles = getComputedStyle(defaultRatioDivEl.nativeElement);
        expect(styles.transform).toEqual(`scale(${DEFAULT_SCALING_RATIO})`);

        // Act
        defaultRatioDivEl.nativeElement.dispatchEvent(new Event("mouseleave"));
        styles = getComputedStyle(defaultRatioDivEl.nativeElement);

        // Assert
        expect(styles.transform).toEqual("");
    });

    it("should properly apply any custom scaling ratio received as input on the parent element on hover", () => {
        // Arrange
        const requestedScaling = 4;
        component.dynamicScaling = requestedScaling;
        const divEl = setupScaling(".dynamic-ratio");

        // Act
        divEl.nativeElement.dispatchEvent(new Event("mouseenter"));
        const styles = getComputedStyle(divEl.nativeElement);

        // Assert
        expect(styles.transform).toEqual(`scale(${requestedScaling})`);
    });
});

@Component({
    selector: "abm-test-host",
    template: `<div gaHoverScale class="no-ratio"></div>
        <div class="dynamic-ratio" gaHoverScale [scalingRatio]="dynamicScaling"></div>`,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [HoverScaleDirective],
})
export class TestHostComponent {
    public dynamicScaling: number = 1;
}
