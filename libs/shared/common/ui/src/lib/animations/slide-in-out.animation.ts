import {
    AnimationTriggerMetadata,
    trigger,
    style,
    animate,
    transition,
    query,
    animateChild,
} from "@angular/animations";

export const slideIn: AnimationTriggerMetadata = trigger("slideIn", [
    transition(":enter", [
        style({ height: 0, opacity: 0 }),
        query("@*", animateChild(), { optional: true }),
        animate("300ms ease", style({ height: "*", opacity: 1 })),
    ]),
]);

export const slideOut: AnimationTriggerMetadata = trigger("slideOut", [
    transition(":leave", [
        query("@*", animateChild(), { optional: true }),
        animate("350ms ease", style({ height: 0, opacity: 0 })),
    ]),
]);

export const slideInOut: AnimationTriggerMetadata = trigger("slideInOut", [
    transition(":enter", [
        style({ height: 0, opacity: 0 }),
        query("@*", animateChild(), { optional: true }),
        animate("300ms ease", style({ height: "*", opacity: 1 })),
    ]),
    transition(":leave", [
        query("@*", animateChild(), { optional: true }),
        animate("350ms ease", style({ height: 0, opacity: 0 })),
    ]),
    transition("void => *", [
        query("@*", animateChild(), { optional: true }),
        animate("300ms ease-out", style({ height: "*", opacity: 1 })),
    ]),
]);
