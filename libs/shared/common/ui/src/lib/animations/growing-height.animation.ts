import { AnimationTriggerMetadata, animate, style, transition, trigger } from "@angular/animations";

export const heightAnimation: AnimationTriggerMetadata = trigger("movingHeight", [
    transition(":enter", [style({ height: 0 }), animate("300ms ease-out", style({ height: "*" }))]),
    transition(":leave", [animate("300ms ease-out", style({ height: 0 }))]),
]);
