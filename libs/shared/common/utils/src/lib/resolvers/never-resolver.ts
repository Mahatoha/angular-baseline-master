import { ActivatedRouteSnapshot } from "@angular/router";

import { concat, Observable, of } from "rxjs";

export abstract class NeverResolver {
    public resolve(activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<void> {
        return concat(this.resolveNever(activatedRouteSnapshot), of(undefined));
    }

    public abstract resolveNever(route: ActivatedRouteSnapshot): Observable<never>;
}
