import { Component, DebugElement, ChangeDetectionStrategy } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { HoverShadowDirective } from "./hover-shadow.directive";
import { DEFAULT_BOX_SHADOW } from "../common/transformations.const";

describe("HoverShadowDirective", () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let component: TestHostComponent;

    const setupShadow = (className: string): DebugElement => {
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

    it("should apply a default box shadow on the parent element on hover", () => {
        // Arrange, Act
        const defaultRatioDivEl = setupShadow(".base-shadow");
        const styles = getComputedStyle(defaultRatioDivEl.nativeElement);

        // Assert
        expect(styles.boxShadow).toEqual(DEFAULT_BOX_SHADOW);
    });

    it("should properly remove any box shadow on the parent element on mouse leave", () => {
        // Arrange
        const defaultRatioDivEl = setupShadow(".base-shadow");
        let styles = getComputedStyle(defaultRatioDivEl.nativeElement);
        expect(styles.boxShadow).toEqual(DEFAULT_BOX_SHADOW);

        // Act
        defaultRatioDivEl.nativeElement.dispatchEvent(new Event("mouseleave"));
        styles = getComputedStyle(defaultRatioDivEl.nativeElement);

        // Assert
        expect(styles.boxShadow).toEqual("");
    });

    it("should properly apply any custom Shadow ratio received as input on the parent element on hover", () => {
        // Arrange
        const customShadow = "fakeBoxShadow";
        component.customHoverShadow = customShadow;
        const divEl = setupShadow(".custom-shadow");

        // Act
        divEl.nativeElement.dispatchEvent(new Event("mouseenter"));
        const styles = getComputedStyle(divEl.nativeElement);

        // Assert
        expect(styles.boxShadow).toEqual(customShadow);
    });
});

@Component({
    selector: "abm-test-host",
    template: `<div gaHoverShadow class="base-shadow"></div>
        <div class="custom-shadow" gaHoverShadow [shadow]="customHoverShadow"></div>`,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [HoverShadowDirective],
})
export class TestHostComponent {
    public customHoverShadow: string = "";
}
