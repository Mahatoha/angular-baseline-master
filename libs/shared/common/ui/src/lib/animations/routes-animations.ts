import {
    AnimationGroupMetadata,
    AnimationQueryMetadata,
    AnimationTriggerMetadata,
    animate,
    animateChild,
    group,
    query,
    style,
    transition,
    trigger,
} from "@angular/animations";

export const mainRoutesAnimation: AnimationTriggerMetadata = trigger("mainRoutesAnimation", [
    transition(":increment", [style({ position: "relative" }), ...slideHorizontal("right")]),
    transition(":decrement", [style({ position: "relative" }), ...slideHorizontal("left")]),
]);

export const secondaryRoutesAnimation: AnimationTriggerMetadata = trigger("secondaryRoutesAnimation", [
    transition(":increment", [style({ position: "relative" }), ...slideVertical("top")]),
    transition(":decrement", [style({ position: "relative" }), ...slideVertical("bottom")]),
]);

function slideHorizontal(direction: "left" | "right"): Array<AnimationQueryMetadata | AnimationGroupMetadata> {
    return [
        query(":enter, :leave", [
            style({
                position: "absolute",
                top: 0,
                [direction]: direction === "left" ? 0 : "100%",
                width: "100%",
            }),
        ]),
        query(":enter", [style({ [direction]: "-100%" })], { optional: true }),
        query(":leave", animateChild(), { optional: true }),
        group([
            query(":leave", [animate("300ms ease", style({ [direction]: "100%", opacity: 0 }))], {
                optional: true,
            }),
            query(":enter", [animate("300ms ease", style({ [direction]: "0%" }))], {
                optional: true,
            }),
            query("@*", animateChild(), { optional: true }),
        ]),
    ];
}

function slideVertical(direction: "top" | "bottom"): Array<AnimationQueryMetadata | AnimationGroupMetadata> {
    return [
        query(":enter, :leave", [
            style({
                position: "absolute",
                overflow: "hidden",
                top: "*",
                backfaceVisibility: "hidden",
                transformStyle: "preserve-3d",
                width: "100%",
            }),
        ]),
        query(":enter", [style({ transform: direction === "top" ? "translateY(100%)" : "translateY(-100%)" })], {
            optional: true,
        }),
        query(":leave", animateChild(), { optional: true }),
        group([
            query(
                ":leave",
                [
                    animate(
                        "300ms ease",
                        style({
                            transform: direction === "top" ? "translateY(-100%)" : "translateY(100%)",
                            opacity: 0,
                        })
                    ),
                ],
                {
                    optional: true,
                }
            ),
            query(":enter", [animate("300ms ease", style({ transform: "translateY(0%)" }))], {
                optional: true,
            }),
        ]),
    ];
}
