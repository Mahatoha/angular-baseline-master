import { AnimationReferenceMetadata, animation, animate, keyframes, style } from "@angular/animations";

export const bounce: AnimationReferenceMetadata = animation(
    [
        style({ transform: "translate3d(0, 0, 0)" }),
        animate(
            "{{timing}}s {{ delay }}s",
            keyframes([
                style({ transform: "translate3d(0, 0, 0)", offset: 0.2 }),
                style({ transform: "translate3d(0, -15px, 0)", offset: 0.4 }),
                style({ transform: "translate3d(0, 0, 0)", offset: 0.53 }),
                style({ transform: "translate3d(0, -7px, 0)", offset: 0.7 }),
                style({ transform: "translate3d(0, -4px, 0)", offset: 0.9 }),
                style({ transform: "translate3d(0, 0, 0)", offset: 1 }),
            ])
        ),
    ],
    { params: { timing: 1, delay: 0 } }
);
