import { Service } from "@angular/core";
import { PreloadingStrategy, Route } from "@angular/router";

import { Observable, of } from "rxjs";

@Service({ autoProvided: false })
export class CustomPreloadingStrategy implements PreloadingStrategy {
    public preload(route: Route, load: () => Observable<unknown>): Observable<unknown | null> {
        if (route.data?.["preload"] != null) {
            return load();
        } else {
            return of(null);
        }
    }
}
