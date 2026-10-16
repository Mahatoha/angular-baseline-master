import { AnimationTriggerMetadata, trigger, transition, style, animate, group, query } from "@angular/animations";

const ANIMATION_TIMING: string = "500ms cubic-bezier(0.785, 0.135, 0.15, 0.86)";

// TODO: A revoir
export const incrementSlideAnimation: AnimationTriggerMetadata = trigger("increment", [
    transition(":increment", [
        group([
            query(
                ":enter",
                [
                    style({ transform: "translate(300%, 0)", opacity: 0 }),
                    animate(ANIMATION_TIMING, style({ transform: "translate(50%, 0)", opacity: 1 })),
                ],
                { optional: true }
            ),
            query(":leave", [animate(ANIMATION_TIMING, style({ transform: "translate(-300%, 0)", opacity: 0 }))], {
                optional: true,
            }),
        ]),
    ]),
    transition(":decrement", [
        group([
            query(
                ":enter",
                [
                    style({ transform: "translate(-300%, 0)", opacity: 0 }),
                    animate(ANIMATION_TIMING, style({ transform: "translate(50%, 0)", opacity: 1 })),
                ],
                { optional: true }
            ),
            query(":leave", [animate(ANIMATION_TIMING, style({ transform: "translate(300%, 0)", opacity: 0 }))], {
                optional: true,
            }),
        ]),
    ]),
]);
