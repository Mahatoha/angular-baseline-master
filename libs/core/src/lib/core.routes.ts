import { Routes } from "@angular/router";

import { BREADCRUMB_CONFIG_SERVICE, BreadcrumbItemsService, ParamsHumanizerPipe } from "@gestion-acte/ui";
import { provideTranslateService } from "@ngx-translate/core";
import { provideTranslateHttpLoader } from "@ngx-translate/http-loader";
import { ConfirmationService } from "@openng/optimus-ui/api";

import { AppRootComponent } from "./app-root/app-root.component";
import { RoutingMenuService } from "./utils/routing-menu.service";

export const coreRoutes: Routes = [
    {
        path: "",
        // resolve: { fetchFull: PrefetchResolver },
        component: AppRootComponent,
        providers: [
            ConfirmationService,
            RoutingMenuService /* AppDataResolver, { provide: PrefetchResolver, useExisting: AppDataResolver }*/,
            BreadcrumbItemsService,
            { provide: BREADCRUMB_CONFIG_SERVICE, useExisting: BreadcrumbItemsService },
            ParamsHumanizerPipe,
            provideTranslateService({
                loader: provideTranslateHttpLoader({
                    prefix: "assets/i18n/",
                    suffix: ".json",
                }),
            }),
        ],
        children: RoutingMenuService.getRoutes(),
    },
];
