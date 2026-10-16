import { Routes } from "@angular/router";

export const authorizationRoutes: Routes = [
    {
        path: "unauthorized",
        loadComponent: () => import("./unauthorized/unauthorized.component").then((cmp) => cmp.UnauthorizedComponent),
        data: { preload: true },
    },
];
