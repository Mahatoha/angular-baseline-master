import { Directive, inject, InjectionToken } from "@angular/core";
import { Router } from "@angular/router";

import { Observable, catchError, forkJoin, from, map } from "rxjs";

import { PrefetchService } from "./prefetch.service";

interface ReferentialService {
    fetchReferential: () => Observable<void>;
}
interface ParamAppliService {
    fetchParamsAppli: () => Observable<void>;
}

export const REFERENTIAL_SERVICE: InjectionToken<ReferentialService> = new InjectionToken("prefetchReferentialService");
export const PARAM_APPLI: InjectionToken<ParamAppliService> = new InjectionToken("prefetchParamAppliService");

@Directive()
export abstract class PrefetchResolver {
    protected abstract prefetchedData: Array<Observable<unknown>>;

    private readonly prefetchService: PrefetchService = inject(PrefetchService);
    private readonly router: Router = inject(Router);
    private readonly paramAppliService: ParamAppliService | null = inject(PARAM_APPLI, { optional: true });
    private readonly referentialService: ReferentialService | null = inject(REFERENTIAL_SERVICE, { optional: true });

    // /!\ DO NOT OVERRIDE
    public resolve(): Observable<void | boolean> {
        return this.prefetchAppData();
    }

    private prefetchAppData(): Observable<void | boolean> {
        this.prefetchService.isLoadingData = true;
        return forkJoin([...this.getDefaultData(), ...this.prefetchedData]).pipe(
            map(() => {
                this.prefetchService.isLoadingData = false;
            }),
            catchError(() => {
                this.prefetchService.isLoadingData = false;
                return from(this.router.navigate(["erreur-application"]));
            })
        );
    }

    private getDefaultData(): Array<Observable<void>> {
        const defaultData: Array<Observable<void>> = [
            this.paramAppliService?.fetchParamsAppli(),
            this.referentialService?.fetchReferential(),
        ].filter((e): e is Observable<void> => e !== undefined);

        return defaultData;
    }
}
