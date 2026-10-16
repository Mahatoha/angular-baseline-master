import { Directive, effect, ElementRef, inject, input, InputSignal, Renderer2 } from "@angular/core";

const CIRCLE_SPACING: number = 20;

@Directive({ selector: "[gaOverlapCircle]" })
export class OverlapCircleDirective {
    private readonly elementRef: ElementRef = inject(ElementRef);
    private readonly renderer: Renderer2 = inject(Renderer2);

    public countSnl: InputSignal<number> = input(0, { alias: "count" });
    public circleIndexSnl: InputSignal<number> = input.required({ alias: "circleIndex" });

    constructor() {
        effect(() => this.setOverlapStyle(this.circleIndexSnl()));
    }

    private setOverlapStyle(index: number): void {
        const { nativeElement } = this.elementRef;
        const circlePosition: number = index + 1;
        this.renderer.setStyle(nativeElement, "right", `${circlePosition * CIRCLE_SPACING}px`);
    }
}
