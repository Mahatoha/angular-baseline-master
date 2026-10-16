import { AsyncPipe } from "@angular/common";
import { Component, inject, input } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";

import { MenuItem } from "@openng/optimus-ui/api";
import { BreadcrumbModule } from "@openng/optimus-ui/breadcrumb";
import { Observable } from "rxjs";
import { delay, filter, map, startWith } from "rxjs/operators";

import { BREADCRUMB_CONFIG_SERVICE, IBreadcrumbItemsBuilder } from "./models";
import { ParamsHumanizerPipe } from "../../humanizer";

const DEFAULT_ROOT_LABEL: string = "Accueil";
const DEFAULT_ROOT_ITEM: MenuItem = {
    routerLink: "/",
    label: DEFAULT_ROOT_LABEL,
    title: DEFAULT_ROOT_LABEL,
};
/**
 * Composant permettant d'afficher le fil d'ariane correspondant à la route actuelle.
 */
@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: "nav[ga-breadcrumb]",
    template: `<p-breadcrumb [model]="(breadcrumbItems$ | async) ?? []" [home]="rootItemSnl()" />`,

    imports: [AsyncPipe, BreadcrumbModule],
    providers: [ParamsHumanizerPipe],
})
export class BreadcrumbComponent {
    public readonly router: Router = inject(Router);
    private readonly breadcrumbItemsService: IBreadcrumbItemsBuilder = inject(BREADCRUMB_CONFIG_SERVICE);

    /**
     * Le libellé du premier segment optionnel à afficher dans le fil d'ariane.
     * S'il n'est pas passé en paramètre ou est passé à la valeur undefined, la valeur par défaut "Accueil" est affichée.
     * Si la valeur null ou vide est passée, le premier segment n'est pas affiché.
     * Si une chaine de caractères non vide est passée, cette valeur est affichée.
     */
    public rootItemSnl = input(DEFAULT_ROOT_ITEM, {
        alias: "rootLabel",
        transform: (rootLabel: string | null | undefined) => {
            if (rootLabel === undefined) {
                return DEFAULT_ROOT_ITEM;
            } else if (rootLabel !== null && rootLabel !== "") {
                return {
                    ...DEFAULT_ROOT_ITEM,
                    label: rootLabel,
                    title: rootLabel,
                };
            }
            return undefined;
        },
    });

    private readonly _routerEvents$: Observable<unknown | null> = this.router.events.pipe(
        filter((e) => e instanceof NavigationEnd),
        delay(0),
        startWith(null)
    );

    public readonly breadcrumbItems$: Observable<Array<MenuItem>> = this._routerEvents$.pipe(
        map(() => this.breadcrumbItemsService.buildBreadcrumbItems())
    );
}
