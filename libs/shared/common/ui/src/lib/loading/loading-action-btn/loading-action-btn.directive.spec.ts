import { Component, ChangeDetectionStrategy } from "@angular/core";
import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { ACTION_NOTIFIER } from "../../models/action-notifier.model";
import { Button, ButtonDirective, ButtonModule } from "@openng/optimus-ui/button";
import { map, merge, of, timer } from "rxjs";

import { LoadingBtnDirective } from "./loading-action-btn.directive";

describe("LoadingActionBtnDirective", () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let component: TestHostComponent;

    describe("Common use cases", () => {
        const onChangeFn = jest.fn().mockImplementation(() => of(true));

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TestHostComponent],
                providers: [{ provide: ACTION_NOTIFIER, useValue: { onChange: onChangeFn } }],
            });

            fixture = TestBed.createComponent(TestHostComponent);
            component = fixture.componentInstance;
        });

        it("should set the button in a loading state only while the provided action is currently running", () => {
            // Arrange
            onChangeFn.mockImplementation((action) => {
                if (action === component.action1) {
                    return of(true);
                }
                return of(false);
            });
            const buttonDir = fixture.debugElement.query(By.directive(ButtonDirective)).injector.get(ButtonDirective);
            const pButton = fixture.debugElement.query(By.css(".pButton")).injector.get(Button);

            // Act
            fixture.detectChanges();

            // Assert
            expect(onChangeFn).toHaveBeenNthCalledWith(1, component.action1, component.defaultEntityId);
            expect(buttonDir.loading).toBe(true);
            expect(onChangeFn).toHaveBeenNthCalledWith(2, component.action2, component.defaultEntityId);
            expect(pButton.loading).toBe(false);
        });

        it("should properly unset the button loading state when the provided action execution has finished", fakeAsync(() => {
            // Arrange
            const ACTION_DELAY = 500;
            onChangeFn.mockImplementation((action) => {
                if (action === component.action1) {
                    return merge(of(true), timer(ACTION_DELAY).pipe(map(() => false)));
                }
                return of(false);
            });
            const buttonDir = fixture.debugElement.query(By.directive(ButtonDirective)).injector.get(ButtonDirective);
            fixture.detectChanges();
            expect(buttonDir.loading).toBe(true);

            // Act
            tick(ACTION_DELAY);

            // Assert
            expect(buttonDir.loading).toBe(false);
        }));
    });
});

@Component({
    selector: "abm-should-throw",
    template: `<button gaLoadingBtn></button>`,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [LoadingBtnDirective],
})
export class DirectiveShouldThrowComponent {}

@Component({
    selector: "abm-test-host",
    template: `<button pButton gaLoadingBtn [loadingAction]="action1" [entityId]="defaultEntityId"></button>
        <p-button class="pButton" gaLoadingBtn [loadingAction]="action2" [entityId]="defaultEntityId" />`,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [LoadingBtnDirective, ButtonModule],
})
export class TestHostComponent {
    public _action1 = "TOTO";
    public _action2 = "TATA";

    public defaultEntityId = 1;

    public set action1(action: string) {
        this.action1 = action;
    }

    public get action1(): string {
        return this._action1;
    }

    public set action2(action: string) {
        this.action2 = action;
    }

    public get action2(): string {
        return this._action2;
    }
}
