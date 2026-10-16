import { Component, ChangeDetectionStrategy } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { LoaderComponent } from "./loader.component";
import { AvailableSize } from "../../models/size.model";

describe("LoaderComponent", () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let component: TestHostComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
    });

    it("should assign a correct loader size based on the size received as input", () => {
        // Arrange
        const loader: HTMLElement = fixture.debugElement.query(By.css(".la-square-jelly-box")).nativeElement;

        // Act, Assert
        fixture.detectChanges();
        expect(loader.classList.contains("la-square-jelly-box--md")).toBe(true);

        component.loaderSize = "sm";
        fixture.detectChanges();
        expect(loader.classList.contains("la-square-jelly-box--sm")).toBe(true);

        component.loaderSize = "lg";
        fixture.detectChanges();
        expect(loader.classList.contains("la-square-jelly-box--lg")).toBe(true);
    });
});

@Component({
    selector: "ga-test-host",
    template: `<ga-loader [size]="loaderSize" />`,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [LoaderComponent],
})
class TestHostComponent {
    private _loaderSize: AvailableSize = "md";

    public set loaderSize(size: AvailableSize) {
        this._loaderSize = size;
    }
    public get loaderSize(): AvailableSize {
        return this._loaderSize;
    }
}
