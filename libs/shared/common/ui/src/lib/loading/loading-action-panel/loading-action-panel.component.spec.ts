import { Component, ChangeDetectionStrategy } from "@angular/core";
import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

import { map, merge, of, timer } from "rxjs";

import { LoadingActionPanelComponent } from "./loading-action-panel.component";
import { ACTION_NOTIFIER, AvailableSize } from "../../models";

describe("LoadingActionPanel", () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let component: TestHostComponent;

    const onChangeFn = jest.fn().mockImplementation(() => of(false));

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestHostComponent, NoopAnimationsModule],
            providers: [{ provide: ACTION_NOTIFIER, useValue: { onChange: onChangeFn } }],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
    });

    it("should display the projected content when the received action is not running", () => {
        // Arrange
        fixture.detectChanges();
        const projectedContentEl = fixture.debugElement.query(By.css(".projected-content"));
        const loaderEl = fixture.debugElement.query(By.css("abm-loader"));

        // Assert
        expect(onChangeFn).toHaveBeenCalledWith(component.loadingAction, component.defaultEntityId);
        expect(projectedContentEl).not.toBeNull();
        expect(loaderEl).toBeNull();
    });

    it("should display a loader instead of the projected content when the received action is running", () => {
        // Arrange
        onChangeFn.mockImplementation(() => of(true));

        // Act
        fixture.detectChanges();
        const projectedContentEl = fixture.debugElement.query(By.css(".projected-content"));
        const loaderEl = fixture.debugElement.query(By.css("abm-loader"));

        // Assert
        expect(onChangeFn).toHaveBeenCalledWith(component.loadingAction, component.defaultEntityId);
        expect(projectedContentEl).toBeNull();
        expect(loaderEl).not.toBeNull();
    });

    it("should properly react to the received action running state", fakeAsync(() => {
        // Arrange
        const ACTION_DELAY = 500;
        onChangeFn.mockImplementation(() => merge(of(true), timer(ACTION_DELAY).pipe(map(() => false))));
        fixture.detectChanges();
        tick(150);

        fixture.detectChanges();
        tick(ACTION_DELAY);

        let projectedContentEl = fixture.debugElement.query(By.css(".projected-content"));
        let loaderEl = fixture.debugElement.query(By.css("abm-loader"));

        expect(projectedContentEl).toBeNull();
        expect(loaderEl).not.toBeNull();

        // Act
        fixture.detectChanges();
        projectedContentEl = fixture.debugElement.query(By.css(".projected-content"));
        loaderEl = fixture.debugElement.query(By.css("abm-loader"));

        // Assert
        expect(projectedContentEl).not.toBeNull();
        expect(loaderEl).toBeNull();
    }));

    it("should display a proper loading text when it's provided", () => {
        // Arrange
        onChangeFn.mockImplementation(() => of(true));
        const testLoadingText = "TestLoadingText";
        component.setLoadingText(testLoadingText);
        fixture.detectChanges();
        const loadingTextEl = fixture.debugElement.query(By.css(".loading-text"));

        // Assert
        expect(loadingTextEl.nativeElement.textContent.trim()).toEqual(testLoadingText);
        component.resetLoadingText();
    });

    it("should assign the  received loader size", () => {
        // Arrange
        onChangeFn.mockImplementation(() => of(true));
        fixture.detectChanges();
        const loaderEl = fixture.debugElement.query(By.css("abm-loader"));
        expect(loaderEl.componentInstance.sizeSnl()).toBe(component.loaderSize);

        // Act
        const newSize = "sm";
        component.loaderSize = newSize;
        fixture.detectChanges();

        // Assert
        expect(loaderEl.componentInstance.sizeSnl()).toBe(newSize);
    });
});

@Component({
    selector: "abm-test-host",
    template: `<section
        gaLoadingActionPanel
        [action]="loadingAction"
        [loadingText]="loadingText"
        [entityId]="defaultEntityId"
        [loaderSize]="loaderSize"
    >
        <div class="projected-content"></div>
    </section>`,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [LoadingActionPanelComponent],
})
class TestHostComponent {
    public loadingAction = "TOTO";
    public defaultEntityId = 1;
    public loadingText = "";
    public loaderSize: AvailableSize = "lg";

    public buttonClass = "loading-button";

    public setLoadingText(text: string): void {
        this.loadingText = text;
    }

    public resetLoadingText(): void {
        this.loadingText = "";
    }
}
