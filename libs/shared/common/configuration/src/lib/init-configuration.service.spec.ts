import { AppConfig, AppConfigInitService } from "..";

const localConfig = {
    environment: "local",
    version: "2.0.0",
    baseUrls: {
        portalApi: "https://ws-myapp-local.local",
    },
    authConfig: {
        issuer: "https://issuer-dev.my.org/auth/realms/myrealm",
        interceptorRegex: "ws-myapp",
    },
    appTitle: "My App",
};

const prodConfig = {
    baseUrls: {
        portalApi: "https://ws-myapp.local",
    },
    authConfig: {
        issuer: "https://issuer.my.org/auth/realms/myrealm",
    },
};

describe("AppConfigInitService.buildAppConfig()", () => {
    let logSpy: jest.SpyInstance;

    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ ...localConfig }),
            })
        ) as jest.Mock;

        logSpy = jest.spyOn(console, "log");
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should call config retrieval and merge methods", async () => {
        // Arrange
        const retrieveConfigsSpy = jest.spyOn(AppConfigInitService, "retrieveConfigs");
        const mergeConfigsSpy = jest.spyOn(AppConfigInitService, "mergeConfigs");

        // Act
        await AppConfigInitService.buildAppConfig<AppConfig>(false);

        // Assert
        expect(retrieveConfigsSpy).toHaveBeenCalledTimes(1);
        expect(mergeConfigsSpy).toHaveBeenCalledTimes(1);
    });

    it("should call merge method with result of retrieval method", async () => {
        // Arrange
        jest.spyOn(AppConfigInitService, "retrieveConfigs").mockImplementation(
            () => new Promise((resolve) => resolve({ appConfig: localConfig, envConfig: prodConfig }))
        );
        const mergeConfigsSpy = jest.spyOn(AppConfigInitService, "mergeConfigs");

        // Act
        await AppConfigInitService.buildAppConfig<AppConfig>(false);

        // Assert
        expect(mergeConfigsSpy).toHaveBeenCalledWith(localConfig, prodConfig);
    });

    it("should log config when not in prod mode", async () => {
        // Arrange

        // Act
        await AppConfigInitService.buildAppConfig<AppConfig>(false);

        // Assert
        expect(logSpy).toHaveBeenCalledTimes(1);
    });

    it("should not log config when in prod mode", async () => {
        // Arrange

        // Act
        await AppConfigInitService.buildAppConfig<AppConfig>(true);

        // Assert
        expect(logSpy).not.toHaveBeenCalled();
    });
});

describe("AppConfigInitService.buildBootstrapedAppConfig()", () => {
    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ ...localConfig }),
            })
        ) as jest.Mock;
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should call config retrieval and merge methods", async () => {
        // Arrange
        const retrieveConfigsSpy = jest.spyOn(AppConfigInitService, "retrieveConfigs");
        const mergeConfigsSpy = jest.spyOn(AppConfigInitService, "mergeConfigs");

        // Act
        await AppConfigInitService.buildBootstrapedAppConfig(false);

        // Assert
        expect(retrieveConfigsSpy).toHaveBeenCalledTimes(1);
        expect(mergeConfigsSpy).toHaveBeenCalledTimes(1);
    });

    it("should call merge method with result of retrieval method", async () => {
        // Arrange
        jest.spyOn(AppConfigInitService, "retrieveConfigs").mockImplementation(
            () => new Promise((resolve) => resolve({ appConfig: localConfig, envConfig: prodConfig }))
        );
        const mergeConfigsSpy = jest.spyOn(AppConfigInitService, "mergeConfigs");

        // Act
        await AppConfigInitService.buildBootstrapedAppConfig(false);

        // Assert
        expect(mergeConfigsSpy).toHaveBeenCalledWith(localConfig, prodConfig);
    });
});

describe("AppConfigInitService.retrieveConfigs()", () => {
    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ ...localConfig }),
            })
        ) as jest.Mock;
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should fetch config once when not in prod mode", async () => {
        // Arrange

        // Act
        const configs = await AppConfigInitService.retrieveConfigs<AppConfig>(false);

        // Assert
        expect(global.fetch).toHaveBeenCalledWith(expect.stringMatching(/^assets\/app-config\.json\?\d+/));
        expect(configs.appConfig).toBeDefined();
        expect(configs.envConfig).not.toBeDefined();
    });

    it("should fetch config twice when in prod mode", async () => {
        // Arrange

        // Act
        const configs = await AppConfigInitService.retrieveConfigs<AppConfig>(true);

        // Assert
        expect(global.fetch).toHaveBeenNthCalledWith(1, expect.stringMatching(/^assets\/app-config\.json\?\d+/));
        expect(global.fetch).toHaveBeenNthCalledWith(2, expect.stringMatching(/^assets\/app-config\.local\.json\?\d+/));
        expect(configs.appConfig).toBeDefined();
        expect(configs.envConfig).toBeDefined();
    });

    it("should fetch config for environment set in base config when in prod mode", async () => {
        // Arrange
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ ...localConfig, environment: "myenv" }),
            })
        ) as jest.Mock;

        // Act
        const configs = await AppConfigInitService.retrieveConfigs<AppConfig>(true);

        // Assert
        expect(global.fetch).toHaveBeenNthCalledWith(2, expect.stringMatching(/^assets\/app-config\.myenv\.json\?\d+/));
        expect(configs.appConfig).toBeDefined();
        expect(configs.envConfig).toBeDefined();
    });
});

describe("AppConfigInitService.mergeConfigs()", () => {
    it("should return base configuration when not env config provided", () => {
        // Arrange
        const expectedResult = {
            environment: "local",
            version: "2.0.0",
            baseUrls: {
                portalApi: "https://ws-myapp-local.local",
            },
            authConfig: {
                issuer: "https://issuer-dev.my.org/auth/realms/myrealm",
                interceptorRegex: "ws-myapp",
            },
            appTitle: "My App",
        };

        // Act
        const result = AppConfigInitService.mergeConfigs(localConfig, undefined);

        // Assert
        expect(result).toStrictEqual(expectedResult);
    });

    it("should return merged base and env configurations when provided", () => {
        // Arrange
        const localConfigUpdated = { ...localConfig, environment: "prod" };

        const expectedResult = {
            environment: "prod",
            version: "2.0.0",
            baseUrls: {
                portalApi: "https://ws-myapp.local",
            },
            authConfig: {
                issuer: "https://issuer.my.org/auth/realms/myrealm",
                interceptorRegex: "ws-myapp",
            },
            appTitle: "My App",
        };

        // Act
        const result = AppConfigInitService.mergeConfigs(localConfigUpdated, prodConfig);

        // Assert
        expect(result).toStrictEqual(expectedResult);
    });
});
