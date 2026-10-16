import { Routes } from "@angular/router";

import { ApplicationErrorComponent } from "@gestion-acte/bootstrap";

// import { AppHostGuard } from "./app-host.guard";

export const appRoutes: Routes = [
    {
        path: "erreur-application",
        component: ApplicationErrorComponent,
    },
    {
        path: "",
        // canMatch: mapToCanMatch([AppHostGuard]),
        loadChildren: () => import("@core/usagers").then((mt) => mt.coreRoutes),
    },
    {
        path: "**",
        redirectTo: "",
        pathMatch: "full",
    },
];
