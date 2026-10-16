import { InjectionToken } from "@angular/core";

import { BreadcrumbItem } from "./breadcrumb-item.model";

export interface BreadcrumbConfig {
    usePathParams: boolean;
    useQueryParams: boolean;
}

export interface IBreadcrumbItemsBuilder {
    buildBreadcrumbItems(): Array<BreadcrumbItem>;
}

export const BREADCRUMB_CONFIG_SERVICE: InjectionToken<IBreadcrumbItemsBuilder> = new InjectionToken(
    "breadcrumbConfigService"
);
