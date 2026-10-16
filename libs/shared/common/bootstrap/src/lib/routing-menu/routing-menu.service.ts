import { Routes } from "@angular/router";

import { MenuItem } from "@openng/optimus-ui/api";

export abstract class ARoutingMenuService {
    public abstract getMenuItems(): Array<MenuItem>;
    public static getRoutes: () => Routes;
}
