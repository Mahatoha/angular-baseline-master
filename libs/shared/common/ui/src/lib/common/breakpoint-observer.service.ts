import { Service } from "@angular/core";

import { fromEvent, Observable } from "rxjs";
import { startWith, map, distinctUntilChanged, shareReplay } from "rxjs/operators";

export const MEDIA_QUERIES: Map<string, string> = new Map([
    ["xxxl", "(min-width:1920px"],
    ["xxl", "(min-width: 1680px)"],
    ["xl", "(min-width: 1200px)"],
    ["lg", "(min-width: 992px)"],
    ["md", "(min-width: 768px)"],
    ["sm", "(min-width: 576px)"],
    ["xs", "(min-width: 0px)"],
]);

/**
 * Service qui permet de déterminer le breakpoint courant en fonction de la taille de la fenêtre.
 */
@Service()
export class BreakpointObserverService {
    private readonly _size$: Observable<string>;

    constructor() {
        this._size$ = fromEvent(window, "resize").pipe(
            startWith(this.getScreenSize()),
            map(() => this.getScreenSize()),
            distinctUntilChanged(),
            shareReplay(1)
        );
    }

    /**
     * Emet le breakpoint courant puis produit une nouvelle émission
     * chaque fois qu'un nouveau breakpoint est atteint suite à un redimensionnement
     * de la fenêtre.
     */
    public get size$(): Observable<string> {
        return this._size$;
    }

    private getScreenSize(): string {
        const [[newSize = "never"]] = Array.from(MEDIA_QUERIES.entries()).filter(
            ([, mediaQuery]) => window.matchMedia(mediaQuery).matches
        );
        return newSize;
    }
}
