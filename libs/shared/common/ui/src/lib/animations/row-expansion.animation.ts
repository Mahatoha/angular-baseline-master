import { AnimationTriggerMetadata, animate, state, style, transition, trigger } from "@angular/animations";

export const rowExpansionAnimation: AnimationTriggerMetadata = trigger("rowExpansionTrigger", [
    state(
        "void",
        style({
            transform: "translateX(-10%)",
            opacity: 0,
        })
    ),
    state(
        "active",
        style({
            transform: "translateX(0)",
            opacity: 1,
        })
    ),
    transition("* <=> *", animate("400ms cubic-bezier(0.86, 0, 0.07, 1)")),
]);
