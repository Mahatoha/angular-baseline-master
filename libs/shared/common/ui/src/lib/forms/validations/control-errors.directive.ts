import {
    ComponentRef,
    Directive,
    ElementRef,
    inject,
    input,
    InputSignal,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewContainerRef,
} from "@angular/core";
import { NgControl } from "@angular/forms";

import { Subject, takeUntil } from "rxjs";

import { ErrMessages } from "./control-errors.model";
import { ErrorMessageComponent } from "./error-message/error-message.component";

// eslint-disable-next-line @angular-eslint/directive-selector, @angular-eslint/prefer-standalone
@Directive({ selector: "[formControl], [formControlName]", standalone: false })
export class ControlErrorsDirective implements OnInit, OnDestroy {
    private readonly controlDir: NgControl = inject(NgControl, { self: true });
    private readonly parentElementRef: ElementRef = inject(ElementRef, { skipSelf: true });
    private readonly renderer: Renderer2 = inject(Renderer2);
    private readonly vcRef: ViewContainerRef = inject(ViewContainerRef);

    public customErrMessagesSnl: InputSignal<ErrMessages | null> = input<ErrMessages | null>(null, {
        alias: "customErrMessages",
    });

    private componentRef?: ComponentRef<ErrorMessageComponent> | null;
    private readonly disposeSignal$ = new Subject<void>();

    public ngOnInit(): void {
        this.renderer.addClass(this.parentElementRef.nativeElement, "gestion-acte-error-message-container");
        this.toggleErrorMessage();
    }

    public ngOnDestroy(): void {
        this.disposeSignal$.next();
        this.disposeSignal$.complete();
    }

    private toggleErrorMessage(): void {
        this.controlDir.valueChanges?.pipe(takeUntil(this.disposeSignal$)).subscribe(() => {
            if (this.componentRef == null && this.isInError()) {
                this.displayErrorMessage();
            } else if (this.componentRef != null && !this.isInError()) {
                this.removeErrorMessage();
            }

            if (this.controlDir.errors && this.componentRef != null) {
                this.componentRef.instance.cdRef.detectChanges();
            }
        });
    }

    private removeErrorMessage(): void {
        this.vcRef.clear();
        this.componentRef?.destroy();
        this.componentRef = null;
    }

    private displayErrorMessage(): void {
        this.componentRef = this.vcRef.createComponent(ErrorMessageComponent);
        this.componentRef.setInput("control", this.controlDir);
        this.componentRef.setInput("errorMessages", this.customErrMessagesSnl());
    }

    private isInError(): boolean {
        return this.controlDir.errors != null && this.controlDir.dirty === true;
    }
}
