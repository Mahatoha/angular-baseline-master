// TODO fix deprecations
import { AnimationTriggerMetadata, trigger, transition, style, animate } from "@angular/animations";

export const slideAvatarInitiales: AnimationTriggerMetadata = trigger("slideAvatar", [
    transition(":enter", [
        style({ transform: "translateX(50%)", opacity: 0, "z-index": 0 }),
        animate("500ms ease-out", style({ transform: "translateX(0)", opacity: 1, "z-index": 99 })),
    ]),
    transition(":leave", [animate("500ms ease-in", style({ transform: "translateX(50%)", opacity: 0, "z-index": 0 }))]),
]);
