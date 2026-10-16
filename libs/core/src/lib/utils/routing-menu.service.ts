import { inject, Service } from "@angular/core";
import { Router, Routes } from "@angular/router";

import { ARoutingMenuService } from "@gestion-acte/bootstrap";
import { MenuItem } from "@openng/optimus-ui/api";

export const MAIN_SEGMENTS_COUNTS: number = 2;

@Service({ autoProvided: false })
export class RoutingMenuService extends ARoutingMenuService {
    private readonly router: Router = inject(Router);

    public getMenuItems(): Array<MenuItem> {
        return [
            // Example for a basic menu
            {
                icon: "pi pi-home",
                label: "Home",
                command: () => {
                    this.router.navigate([""]);
                },
            },
        ];
    }

    public static override getRoutes(): Routes {
        const coreRoutes: Routes = [
            // Lazy load every features of your application here
        ];

        return coreRoutes;
    }
}
