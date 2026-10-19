import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterModule } from "@angular/router";

import { PrefetchService, SplashScreenComponent } from "@gestion-acte/bootstrap";
import { APP_CONFIG, AppConfig } from "@shared/usagers/configuration";
import { Observable } from "rxjs";

@Component({
    selector: "gau-app-host",
    imports: [RouterModule, SplashScreenComponent, AsyncPipe],

    template: `@if (isLoadingData$ | async) {
            <abm-splash-screen [appTitle]="appTitle" />
        } @else {
            <router-outlet />
        } `,
})
export class AppHostComponent {
    private readonly appConfig: AppConfig = inject(APP_CONFIG);
    private readonly prefetchService: PrefetchService = inject(PrefetchService);

    protected readonly isLoadingData$: Observable<boolean> = this.prefetchService.isLoadingData$;
    protected readonly appTitle: string = this.appConfig.appTitle;
}
