import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { ProgressService } from "../progress.service";
import { ProgressBar } from "@openng/optimus-ui/progressbar";
import { BehaviorSubject } from "rxjs";

import { ProgressBarComponent } from "./progress-bar.component";

describe("ProgressBarComponent", () => {
    let fixture: ComponentFixture<ProgressBarComponent>;

    const mockProgressValueSubject$ = new BehaviorSubject(0);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ProgressBarComponent],
        })
            .overrideProvider(ProgressService, {
                useValue: { progress$: mockProgressValueSubject$ },
            })
            .compileComponents();

        fixture = TestBed.createComponent(ProgressBarComponent);
    });

    afterEach(() => {
        mockProgressValueSubject$.next(0);
    });

    afterAll(() => {
        mockProgressValueSubject$.complete();
    });

    it("should display a correct progress value", () => {
        // Arrange
        const testProgressValue = 42;
        mockProgressValueSubject$.next(testProgressValue);

        // Act
        fixture.detectChanges();
        const progressBar = fixture.debugElement.query(By.css("p-progressbar")).injector.get(ProgressBar);

        // Assert
        expect(progressBar.value).toEqual(testProgressValue);
    });

    it("should prevent the progress bar animation when the progress value is 0", () => {
        // Arrange
        fixture.detectChanges();
        const progressBarEl = fixture.debugElement.query(By.css("p-progressbar"));

        // Assert
        expect(progressBarEl.nativeElement.classList.contains("p-not-animate")).toBe(true);
    });
});
