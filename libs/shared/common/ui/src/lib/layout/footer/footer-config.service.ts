import { Service } from "@angular/core";

import { BehaviorSubject, Observable, shareReplay } from "rxjs";

import { FooterItem } from "./models/footer-item.model";
import { IConfig } from "../../models";

/**
 * Service exposant la configuration par défaut pour le footer Région Sud.
 */
@Service({ autoProvided: false })
export class FooterConfigService implements IConfig<Array<FooterItem>> {
    private readonly _configurationSubject$ = new BehaviorSubject<Array<FooterItem>>([
        {
            label: "Mentions légales",
            action: () => {
                window.open("http://localhost/mentions-legales", "Mentions légales", "width=800,height=600");
            },
        },
        {
            label: "Données personnelles",
            action: () => {
                window.open(
                    "http://localhost/mentions-legales/donnees-personnelles",
                    "Données personnelles",
                    "width=800,height=600"
                );
            },
        },
    ]);

    public set configuration(config: Array<FooterItem>) {
        this._configurationSubject$.next(config);
    }

    public get configuration(): Array<FooterItem> {
        return this._configurationSubject$.value;
    }

    public get configuration$(): Observable<Array<FooterItem>> {
        return this._configurationSubject$.asObservable().pipe(shareReplay(1));
    }
}
