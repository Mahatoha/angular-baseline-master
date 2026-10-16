import { Component, ChangeDetectionStrategy } from "@angular/core";
import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { ACTION_NOTIFIER } from "../../models/action-notifier.model";
import { Button, ButtonDirective, ButtonModule } from "@openng/optimus-ui/button";
import { map, merge, of, timer } from "rxjs";

import { LoadingActionBtnComponent } from "./loading-action-btn.component";

describe("LoadingActionBtn", () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let component: TestHostComponent;

    const onChangeFn = jest.fn().mockImplementation(() => of(false));

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestHostComponent],
            providers: [{ provide: ACTION_NOTIFIER, useValue: { onChange: onChangeFn } }],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
    });

    it("should display the projected content when the received action is not running", () => {
        // Arrange
        fixture.detectChanges();
        const projectedContentEl = fixture.debugElement.query(By.css(".projected-content"));

        // Assert
        expect(onChangeFn).toHaveBeenCalledWith(component.loadingAction, component.defaultEntityId);
        expect(projectedContentEl).not.toBeNull();
    });

    it("should display a loading button instead of the projected content when the received action is running", () => {
        // Arrange
        onChangeFn.mockImplementation(() => of(true));

        // Act
        fixture.detectChanges();
        const projectedContentEl = fixture.debugElement.query(By.css(".projected-content"));
        const buttonEl = fixture.debugElement.query(By.css(".loading-button"));
        const buttonDir = buttonEl.injector.get(Button);

        // Assert
        expect(onChangeFn).toHaveBeenCalledWith(component.loadingAction, component.defaultEntityId);
        expect(projectedContentEl).toBeNull();
        expect(buttonEl).not.toBeNull();
        expect(buttonDir.loading).toBe(true);
    });

    it("should properly react to the received action running state", fakeAsync(() => {
        // Arrange
        const ACTION_DELAY = 500;

        onChangeFn.mockImplementation(() => merge(of(true), timer(ACTION_DELAY).pipe(map(() => false))));
        fixture.detectChanges();

        let projectedContentEl = fixture.debugElement.query(By.css(".projected-content"));
        let buttonEl = fixture.debugElement.query(By.css(".loading-button"));
        const buttonDir = buttonEl.injector.get(Button);

        expect(projectedContentEl).toBeNull();
        expect(buttonDir.loading).toBe(true);

        // Act
        tick(ACTION_DELAY);
        fixture.detectChanges();
        projectedContentEl = fixture.debugElement.query(By.css(".projected-content"));
        buttonEl = fixture.debugElement.query(By.css(".loading-button"));

        // Assert
        expect(projectedContentEl).not.toBeNull();
        expect(buttonEl).toBeNull();
    }));

    it("should set the proper loading text to the button directive", () => {
        // Arrange
        onChangeFn.mockImplementation(() => of(true));
        fixture.detectChanges();
        const buttonDir = fixture.debugElement.query(By.css(".loading-button")).injector.get(Button);

        // Assert
        expect(buttonDir.label).toEqual(component.loadingText);
    });

    it("should assign received class to the loading button", () => {
        // Arrange
        const testClass = "TestClass";
        component.setButtonClass(testClass);

        onChangeFn.mockImplementation(() => of(true));
        fixture.detectChanges();
        const buttonEl = fixture.debugElement.query(By.css(`.${testClass}`));

        // Assert
        expect(buttonEl.nativeElement.classList.contains(testClass)).toBe(true);
        component.resetButtonClass();
    });
});

@Component({
    selector: "ga-test-host",
    template: `<div
        gaLoadingActionBtn
        [loadingAction]="loadingAction"
        [loadingText]="loadingText"
        [entityId]="defaultEntityId"
        [buttonClass]="buttonClass"
    >
        <p-button class="projected-content" styleClass="projected-content" />
    </div>`,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [LoadingActionBtnComponent, ButtonModule],
})
class TestHostComponent {
    public loadingAction = "TOTO";
    public defaultEntityId = 1;
    public loadingText = "";

    public buttonClass = "loading-button";

    public setLoadingText(text: string): void {
        this.loadingText = text;
    }

    public setButtonClass(klass: string): void {
        this.buttonClass = klass;
    }

    public resetButtonClass(): void {
        this.buttonClass = "loading-button";
    }
}
