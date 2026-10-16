import { inject, Service } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { RouterStateSnapshot, TitleStrategy } from "@angular/router";

import { BehaviorSubject, Observable } from "rxjs";

interface CustomTitleConfig {
    usePathParams: boolean;
    useQueryParams: boolean;
}

@Service()
export class CustomTitleService extends TitleStrategy {
    private readonly titleService: Title = inject(Title);

    private defaultConfig: CustomTitleConfig = { usePathParams: false, useQueryParams: false };
    private readonly _titleSubject$ = new BehaviorSubject<string | null>("");
    private readonly _titleConfigSubject$ = new BehaviorSubject<CustomTitleConfig>({
        ...this.defaultConfig,
    });

    public set defaultConfiguration(config: CustomTitleConfig) {
        this.defaultConfig = config;
    }

    public get defaultConfiguration(): CustomTitleConfig {
        return this.defaultConfig;
    }

    public set title(title: string) {
        this.titleService.setTitle(title);
        this._titleSubject$.next(title);
    }

    public get title$(): Observable<string | null> {
        return this._titleSubject$.asObservable();
    }

    public set titleConfig(titleConfig: CustomTitleConfig) {
        this._titleConfigSubject$.next(titleConfig);
    }

    public get titleConfig(): CustomTitleConfig {
        return this._titleConfigSubject$.value;
    }

    public override updateTitle(snapshot: RouterStateSnapshot): void {
        const title: string | undefined = this.buildTitle(snapshot);
        if (title != null) {
            this.titleService.setTitle(title);
            this._titleSubject$.next(title);
        }
    }

    public resetConfigToDefault(): void {
        this.titleConfig = this.defaultConfig;
    }
}
