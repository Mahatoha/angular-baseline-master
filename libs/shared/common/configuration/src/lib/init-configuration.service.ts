import { InjectionToken } from "@angular/core";

import { deepmerge } from "deepmerge-ts";

import { AppConfig, AppConfigs } from "./configuration.model";
import { Environment } from "./environment.model";

export const ENVIRONMENT: InjectionToken<Environment> = new InjectionToken<Environment>("environment");
// TODO : to be declared inside each app alongside with their specific config model
// export const APP_CONFIG: InjectionToken<AppConfig> = new InjectionToken<AppConfig>(
//     "applicationConfiguration"
// );

export class AppConfigInitService {
    /**
     * Récupère la configuration de l'application dans les assets. En mode production,
     * la configuration liée à l'environnement est également récupérée et est mergée avec
     * la configuration de base.
     * Elle revient à appeler successivement les méthodes AppConfigInitService.retrieveConfigs()
     * et AppConfigInitService.mergeConfigs().
     * @param isProdMode indique si l'application est lancée en mode production ou non
     * @returns l'objet de configuration reconstitué depuis les assets de l'application
     */
    public static async buildAppConfig<T extends object>(isProdMode: boolean): Promise<T> {
        const { appConfig, envConfig }: AppConfigs<T> = await AppConfigInitService.retrieveConfigs<T>(isProdMode);

        const fullConfig: T = AppConfigInitService.mergeConfigs<T>(appConfig, envConfig);

        if (!isProdMode) {
            // eslint-disable-next-line no-console
            console.log(fullConfig);
        }

        return fullConfig;
    }
    /**
     * Récupère la configuration de l'application dans les assets. En mode production,
     * la configuration liée à l'environnement est également récupérée et est mergée avec
     * la configuration de base.
     * Elle revient à appeler successivement les méthodes AppConfigInitService.retrieveConfigs()
     * et AppConfigInitService.mergeConfigs().
     * @param isProdMode indique si l'application est lancée en mode production ou non
     * @returns l'objet AppConfig reconstitué depuis les assets de l'application
     */
    public static async buildBootstrapedAppConfig(isProdMode: boolean): Promise<AppConfig> {
        return AppConfigInitService.buildAppConfig<AppConfig>(isProdMode);
    }

    /**
     * Récupère la configuration de l'application dans les assets et, si en mode prod,
     * la configuration de l'environnement.
     * @param isProdMode indique si l'application est lancée en mode production ou non
     * @returns un objet contenant la configuration de base et de l'environnement
     */
    public static async retrieveConfigs<T extends object>(isProdMode: boolean): Promise<AppConfigs<T>> {
        const appConfig: T = await AppConfigInitService.fetchConfig<T>();

        let envConfig: T | undefined;
        if (isProdMode && "environment" in appConfig && typeof appConfig.environment === "string") {
            envConfig = await AppConfigInitService.fetchConfig<T>(appConfig.environment);
        }

        return { appConfig, envConfig };
    }

    /**
     * Fusionne la configuration de base de l'application avec celle de l'environnement s'il y en a une (deepmerge).
     * @param appConfig la configuration de base de l'application
     * @param envConfig la configuration pour l'environnement
     * @returns la fusion des configurations de base et de l'environnement
     */
    public static mergeConfigs<T extends object>(appConfig: T, envConfig: T | undefined): T {
        return envConfig !== undefined ? (deepmerge(appConfig, envConfig) as T) : appConfig;
    }

    /**
     * Récupère la configuration de base de l'application quand aucun paramètre n'est passé
     * en entrée (ou une chaine vide) ou de l'environnement quand une chaine non vide est passée en paramètre.
     * @param environment l'environnement pour lequel récupérer la config ou undefined/chaine vide
     * @returns la configuration
     */
    private static async fetchConfig<T extends object>(environment?: string | null): Promise<T> {
        const suffix: string = environment != null && environment.length > 0 ? `.${environment}` : "";
        const configUri: string = `assets/app-config${suffix}.json?${new Date().getTime()}`;
        return fetch(configUri).then((res) => res.json() as Promise<T>);
    }
}
