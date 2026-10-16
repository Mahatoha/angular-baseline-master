import { Component, input, InputSignal } from "@angular/core";

import { AvailableSize } from "../../models/size.model";

@Component({
    selector: "ga-loader",
    template: `<div
        class="la-square-jelly-box"
        [class.loading-text--sm]="sizeSnl() === 'sm'"
        [class.loading-text--md]="sizeSnl() === 'md'"
        [class.loading-text--lg]="sizeSnl() === 'lg'"
    >
        <div></div>
        <div></div>
    </div>`,
    styleUrls: ["./loader.component.scss"],
})
export class LoaderComponent {
    public sizeSnl: InputSignal<AvailableSize> = input<AvailableSize>("md", { alias: "size" });
}
