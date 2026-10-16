import { MenuItem } from "@openng/optimus-ui/api";

export interface BreadcrumbItem extends MenuItem {
    humanizer?: string | ((param: string) => string);
    // TODO: Actions ? etc... using maybe route data
}
