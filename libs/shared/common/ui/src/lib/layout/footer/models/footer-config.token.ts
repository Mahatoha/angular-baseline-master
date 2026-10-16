import { InjectionToken } from "@angular/core";

import { FooterItem } from "./footer-item.model";
import { IConfig } from "../../../models";
import { FooterConfigService } from "../footer-config.service";

export type IFooterConfigService = IConfig<Array<FooterItem>>;

/**
 * Token d'injection pour l'interface {@link IComponentConfig}
 * dont le type générique est résolu par l'interface {@link FooterItem}.
 *
 * Provide le {@link FooterConfigService} par défaut comme singleton dans l'application.
 * Override ce token permet de déterminer depuis le contexte applicatifs les différents liens à
 * afficher dans le footer.
 */
export const FOOTER_CONFIG: InjectionToken<IFooterConfigService> = new InjectionToken("footerConfigInjectionToken", {
    providedIn: "root",
    factory: () => new FooterConfigService(),
});
