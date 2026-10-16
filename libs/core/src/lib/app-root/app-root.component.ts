import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { BreadcrumbComponent, FooterComponent } from "@gestion-acte/ui";
import { DATE_FORMAT_CALENDAR } from "@gestion-acte/utils";
import { TranslateService } from "@ngx-translate/core";
import { Optimus } from "@openng/optimus-ui/config";
import { APP_CONFIG, AppConfig } from "@shared/usagers/configuration";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "gau-app-root",
    templateUrl: "./app-root.component.html",
    styleUrls: ["./app-root.component.scss"],
    imports: [RouterOutlet, BreadcrumbComponent, FooterComponent],
})
export class AppRootComponent implements OnInit, OnDestroy {
    private readonly appConfig: AppConfig = inject(APP_CONFIG);
    private readonly translateService: TranslateService = inject(TranslateService);
    private readonly primeNG: Optimus = inject(Optimus);

    public readonly appTitle: string = this.appConfig.appTitle;
    public readonly appVersion: string = this.appConfig.version;

    private readonly disposeSignal$ = new Subject<void>();
    private readonly langChangeSignal$ = new Subject<void>();

    public ngOnInit(): void {
        const defaultLang: string = "fr";
        this.translateService.setFallbackLang(defaultLang);
        // Force date format for calendar when i18n file is loading (for example when the user reload a page containing calendars)
        this.primeNG.translation.dateFormat = DATE_FORMAT_CALENDAR;
        this.translate(defaultLang);
    }

    public ngOnDestroy(): void {
        this.disposeSignal$.next();
        this.disposeSignal$.complete();
        this.langChangeSignal$.complete();
    }

    public translate(lang: string): void {
        this.langChangeSignal$.next();
        this.translateService.use(lang);
        this.translateService
            .get(lang)
            .pipe(takeUntil(this.disposeSignal$), takeUntil(this.langChangeSignal$))
            .subscribe((res) => {
                this.primeNG.setTranslation(res);
            });
    }
}
