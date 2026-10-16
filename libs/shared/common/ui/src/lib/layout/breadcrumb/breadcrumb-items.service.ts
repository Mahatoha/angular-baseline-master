/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { inject, Service } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, UrlSerializer, createUrlTreeFromSnapshot } from "@angular/router";

import { MenuItem } from "@openng/optimus-ui/api";
import { BehaviorSubject, Observable, shareReplay } from "rxjs";

import { BreadcrumbConfig, BreadcrumbItem, IBreadcrumbItemsBuilder } from "./models";
import { ParamsHumanizerPipe } from "../../humanizer";
import { IConfig } from "../../models";

const PATH_PARAM_PREFIX: string = ":";

@Service({ autoProvided: false })
export class BreadcrumbItemsService implements IConfig<BreadcrumbConfig>, IBreadcrumbItemsBuilder {
    private readonly urlSerializer: UrlSerializer = inject(UrlSerializer);
    private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
    private readonly paramsHumanizerPipe: ParamsHumanizerPipe = inject(ParamsHumanizerPipe);

    private readonly _configurationSubject$ = new BehaviorSubject<BreadcrumbConfig>({
        usePathParams: true,
        useQueryParams: true,
    });

    public set configuration(config: BreadcrumbConfig) {
        this._configurationSubject$.next(config);
    }

    public get configuration(): BreadcrumbConfig {
        return this._configurationSubject$.value;
    }

    public get configuration$(): Observable<BreadcrumbConfig> {
        return this._configurationSubject$.asObservable().pipe(shareReplay(1));
    }

    public buildBreadcrumbItems(): Array<MenuItem> {
        const items: Array<MenuItem> = [];
        let firstChild: ActivatedRoute | null = this.activatedRoute.firstChild;

        const { title } = this.activatedRoute.snapshot;
        if (this.isStringNotEmpty(title)) {
            items.push({ title, label: title });
        }

        while (firstChild) {
            const { snapshot } = firstChild;

            if (firstChild.routeConfig?.path === "") {
                firstChild = firstChild.firstChild;
                continue;
            }

            if (snapshot.url.length > 0) {
                items.push(...this.getSegmentTitles(snapshot, this.configuration));
            }

            if (this.configuration.useQueryParams && firstChild.firstChild == null) {
                items.push(...this.buildQueryParamsTree(firstChild.snapshot));
            }

            firstChild = firstChild.firstChild;
        }

        return items;
    }

    private getSegmentTitles(routeSnapshot: ActivatedRouteSnapshot, config: BreadcrumbConfig): Array<MenuItem> {
        const items: Array<BreadcrumbItem> = [];
        const mainTitle: string | undefined = routeSnapshot.title;

        if (config.usePathParams && routeSnapshot.paramMap.keys.length > 0) {
            return this.buildTitleTreeWithParams(routeSnapshot, mainTitle);
        }

        if (this.isStringNotEmpty(mainTitle) && mainTitle !== routeSnapshot.parent?.title) {
            items.push({ title: mainTitle, routerLink: this.getFullPath(routeSnapshot), label: mainTitle });
        }

        return items;
    }

    private buildTitleTreeWithParams(snapshot: ActivatedRouteSnapshot, mainTitle?: string | null): Array<MenuItem> {
        const items: Array<MenuItem> = [];

        if (snapshot.routeConfig?.path == null) {
            return items;
        }

        const segments: Array<string> = snapshot.routeConfig.path.split("/");
        segments.forEach((segment) => {
            if (segment.includes(PATH_PARAM_PREFIX)) {
                const paramKey: string = this.extractParamKey(segment);
                items.push(this.getParamTitle(snapshot, paramKey));
            } else if (this.isStringNotEmpty(mainTitle) && mainTitle !== snapshot.parent?.title) {
                items.push({ title: mainTitle, routerLink: this.getFullPath(snapshot), label: mainTitle });
            }
        });

        return items;
    }

    private getParamTitle(snapshot: ActivatedRouteSnapshot, paramKey: string): MenuItem {
        const paramValue: string = snapshot.paramMap.get(paramKey) as string;
        const title: string =
            snapshot.data[paramKey]?.humanizer !== undefined
                ? this.humanize(paramValue, snapshot.data[paramKey]?.humanizer)
                : paramValue;
        return {
            label: title,
            title,
            routerLink: this.getFullPath(snapshot),
        };
    }

    private extractParamKey(path: string): string {
        return path.split(":")[1];
    }

    private buildQueryParamsTree(snapshot: ActivatedRouteSnapshot): Array<MenuItem> {
        return Object.entries(snapshot.queryParams).map(([pKey, pValue]) => {
            const title: string =
                snapshot.data[pKey]?.humanizer !== undefined
                    ? this.humanize(pValue, snapshot.data[pKey]?.humanizer)
                    : pValue;
            return {
                label: title,
                title,
            };
        });
    }

    private getFullPath(snapshot: ActivatedRouteSnapshot): string {
        return this.urlSerializer.serialize(createUrlTreeFromSnapshot(snapshot, ["."]));
    }

    private isStringNotEmpty(testString: string | null | undefined): testString is string {
        return testString != null && testString.length > 0;
    }

    private humanize(toTransform: string, humanizer: string | ((param: string) => string)): string {
        return this.paramsHumanizerPipe.transform(toTransform, humanizer);
    }
}
