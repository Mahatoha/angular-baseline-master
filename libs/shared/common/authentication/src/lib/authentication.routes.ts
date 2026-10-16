import { Routes } from "@angular/router";

import { AuthenticationShellComponent } from "./shell/authentication-shell.component";

export const authenticationRoutes: Routes = [
    {
        path: "authentification",
        component: AuthenticationShellComponent,
        children: [
            {
                path: "login",
                loadComponent: () => import("./authentication/login/login.component").then((cmp) => cmp.LoginComponent),
                data: { preload: true },
            },
            {
                path: "logout",
                loadComponent: () =>
                    import("./authentication/logout/logout.component").then((cmp) => cmp.LogoutComponent),
                data: { preload: true },
            },
            {
                path: "erreur-login",
                loadComponent: () =>
                    import("./authentication/error-login/error-login.component").then((cmp) => cmp.ErrorLoginComponent),
                data: { preload: true },
            },
        ],
    },
];
