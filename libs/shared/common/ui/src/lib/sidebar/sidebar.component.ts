import { AsyncPipe } from "@angular/common";
import {
    Component,
    HostBinding,
    InputSignal,
    Signal,
    WritableSignal,
    computed,
    inject,
    input,
    signal,
} from "@angular/core";
import { NavigationEnd, Params, Router } from "@angular/router";

import { MenuItem } from "@openng/optimus-ui/api";
import { MenuModule } from "@openng/optimus-ui/menu";
import { Observable, filter, map, startWith } from "rxjs";

import { IsSubstringPipe } from "../pipes/is-substring/is-substring.pipe";

/**
 * Barre de navigation par défaut sur les applications Région Sud.
 */
@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: "nav[gaSidebar]",
    templateUrl: "./sidebar.component.html",
    styleUrls: ["./sidebar.component.scss"],
    imports: [AsyncPipe, IsSubstringPipe, MenuModule],
})
export class SidebarComponent {
    private readonly router: Router = inject(Router);

    public menuItemsSnl: InputSignal<Array<MenuItem>> = input.required<Array<MenuItem>>({
        alias: "menuItems",
    });

    @HostBinding("class") public get SidebarSmallClass(): string {
        return this.openedSnl() ? "" : "sidebar-small";
    }

    public openedSnl: WritableSignal<boolean> = signal<boolean>(true);

    public toggleButtonClassSnl: Signal<string> = computed(() =>
        this.openedSnl() ? "pi-angle-double-left" : "pi-angle-double-right"
    );

    public readonly activeRoute$: Observable<string>;

    constructor() {
        this.activeRoute$ = this.selectActiveUrl();
    }

    public navigateTo(menuItem: MenuItem): void {
        const { routerLink, queryParams, queryParamsHandling } = menuItem;

        if (this.router.url.includes(routerLink)) {
            const currentParams: Params = this.router.parseUrl(this.router.url).queryParams;
            this.router.navigate([routerLink], {
                queryParams: currentParams,
            });
        } else {
            this.router.navigate([routerLink], {
                queryParams,
                queryParamsHandling,
            });
        }
    }

    public toggleOpened(): void {
        this.openedSnl.set(!this.openedSnl());
    }

    private selectActiveUrl(): Observable<string> {
        return this.router.events.pipe(
            filter((e) => e instanceof NavigationEnd),
            startWith(null),
            map(() => this.router.url)
        );
    }
}
