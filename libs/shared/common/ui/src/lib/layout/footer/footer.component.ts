import { Component, inject, Signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";

// import { distinctUntilChangedJson } from "@region-sud/rxjs-operators";

import { FOOTER_CONFIG } from "./models/footer-config.token";
import { FooterItem } from "./models/footer-item.model";
import { IConfig } from "../../models";

/**
 * Présente un ensemble de liens ou de call-to-actions.
 */
@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: "footer[ga-footer]",
    templateUrl: "./footer.component.html",
    styleUrls: ["./footer.component.scss"],
})
export class FooterComponent {
    private readonly footerConfigService: IConfig<Array<FooterItem>> = inject(FOOTER_CONFIG);

    /**
     * La configuration des liens à afficher dans le footer.
     */
    // TODO uncomment distinctUntilChangedJson
    public readonly footerConfiguration: Signal<Array<FooterItem>> = toSignal(
        this.footerConfigService.configuration$.pipe(/* distinctUntilChangedJson()*/),
        {
            initialValue: [],
        }
    );
}
