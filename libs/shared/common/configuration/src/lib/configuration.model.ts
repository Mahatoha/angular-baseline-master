export interface AppConfig {
    appTitle: string;
    baseUrls: Record<string, string>;
    environment: string;
    version: string;
}

export interface AppConfigs<T extends object> {
    appConfig: T;
    envConfig?: T;
}
