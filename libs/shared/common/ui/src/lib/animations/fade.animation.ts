import {
    AnimationTriggerMetadata,
    trigger,
    transition,
    style,
    animate,
    state,
    animateChild,
    query,
    group,
} from "@angular/animations";

export const fadeInAnimation: AnimationTriggerMetadata = trigger("fadeIn", [
    transition("void => *", [
        style({ opacity: 0 }),
        group([query("@*", animateChild(), { optional: true }), animate("250ms ease-out", style({ opacity: 1 }))]),
    ]),
]);

export const fadeOutAnimation: AnimationTriggerMetadata = trigger("fadeOut", [
    transition("* => void", [
        style({ opacity: 1 }),
        group([query("@*", animateChild(), { optional: true }), animate("250ms ease-in", style({ opacity: 0 }))]),
    ]),
]);

export const fadeInOutAnimation: AnimationTriggerMetadata = trigger("fade", [
    transition("void => *", [
        style({ opacity: 0 }),
        group([animate("250ms ease-out", style({ opacity: 1 })), query("@*", animateChild(), { optional: true })]),
    ]),
    transition("* => void", [
        style({ opacity: 1 }),
        group([animate("250ms ease-in", style({ opacity: 0 })), query("@*", animateChild(), { optional: true })]),
    ]),
]);

// TODO: Move this
export const fadeInOutTarifLycee: AnimationTriggerMetadata = trigger("createTarifLyceeAnimation", [
    state("Lycee", style({ opacity: 1 })),
    state("void", style({ opacity: 0 })),
    transition("void => Lycee", [animate("250ms ease-out", style({ height: "*", opacity: 1 }))]),
    transition("* => void", [animate("200ms ease-in", style({ height: 0, opacity: 0 }))]),
]);
