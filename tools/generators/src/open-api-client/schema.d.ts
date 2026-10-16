export interface OpenAPIConfig {
    $schema: string;
    apiName: string;

    apiService?: string;
    /**
     * Name for the base service class to generate. Defaults to '{apiName}BaseService'.
     */
    baseService?: string;

    services?: boolean;
    promises?: boolean;

    /**
     * url of the Api to fetch (only domains and port, not .json url).
     */
    baseUrl: string;

    /**
     * Name for the configuration class to generate. Defaults to '{apiName}ApiConfiguration'.
     */
    configuration?: string;
    /**
     * Defines which paths to use which responseType, commonly used when build-in deduction
     * can't fullfill your needs
     */
    customizedResponseType?: { [key: string]: CustomizedResponseType };
    /**
     * Tag name assumed for operations without tags. Defaults to 'Api'.
     */
    defaultTag?: string;
    /**
     * Determines how root enums will be generated. Possible values are:
     *
     * - `alias`: just generate a type alias with the possible values;
     * - `upper` for an enum with UPPER_CASE names, and;
     * - `pascal` for enum PascalCase names. Defaults to 'pascal'.
     */
    enumStyle?: EnumStyle;
    /**
     * When specified, ignores on generated services any parameters whose names are in this list.
     */
    excludeParameters?: Array<string>;
    /**
     * When specified, filters the generated services, excluding any service corresponding to
     * this list of tags.
     */
    excludeTags?: Array<string>;
    /**
     * Indicates the timeout when fetching the input URL, in milliseconds. Defaults to 20
     * seconds (20000).
     */
    fetchTimeout?: number;
    /**
     * Indicates whether or not to ignore model files that are not referenced by any operation.
     * Defaults to true.
     */
    ignoreUnusedModels?: boolean;
    /**
     * The library name used to import it, like @myorg/my-awesome-lib?Defaults to @apis/{apiName}
     */
    importPath?: string;
    /**
     * When specified, filters the generated services, including only those corresponding to
     * this list of tags.
     */
    includeTags?: Array<string>;
    /**
     * When set to true, a index.ts file will be generated that exports all generated files.
     */
    indexFile?: boolean;
    /**
     * The input file or URL to the OpenAPI 3 specification, JSON or YAML, local file or URL
     */
    input?: string;

    isRemoteSpec?: boolean;
    /**
     * Typescript file, without '.ts' extension that exports all models. Set to false to skip.
     * Defaults to `models`.
     */
    modelIndex?: boolean | string;
    /**
     * Prefix for generated model classes. Defaults to empty.
     */
    modelPrefix?: string;
    /**
     * Suffix for generated model classes. Defaults to empty.
     */
    modelSuffix?: string;
    /**
     * Class name of the module that provides all services. Set to false to skip. Defaults to
     * `ApiModule`.
     */
    module?: boolean | string;
    /**
     * Where generated files will be written to. Defaults to 'src/api'.
     */
    output?: string;
    /**
     * Indicates whether or not to remove any files in the output folder that were not
     * generated. Defaults to true.
     */
    removeStaleFiles?: boolean;
    /**
     * Name for the request builder class to generate. Defaults to '{apiName}RequestBuilder'.
     */
    requestBuilder?: string;
    /**
     * Name for the response class to generate. Defaults to '{apiName}StrictHttpResponse'.
     */
    response?: string;
    /**
     * Typescript file, without '.ts' extension that exports all services. Set to false to skip.
     * Defaults to `services`.
     */
    serviceIndex?: boolean | string;
    /**
     * Prefix for generated service classes. Defaults to empty.
     */
    servicePrefix?: string;
    /**
     * Suffix for generated service classes. Defaults to `Service`.
     */
    serviceSuffix?: string;
    /**
     * Skip formatting files.
     */
    skipFormat?: boolean;
    /**
     * When specified, does not generate a $Json suffix.
     */
    skipJsonSuffix?: boolean;
    /**
     * Custom templates directory. Any `.handlebars` files here will be used instead of the
     * corresponding default.
     */
    templates?: string;
}

export interface CustomizedResponseType {
    toUse: ToUse;
}

export enum ToUse {
    Arraybuffer = "arraybuffer",
    Blob = "blob",
    Document = "document",
    JSON = "json",
}

/**
 * Determines how root enums will be generated. Possible values are:
 *
 * - `alias`: just generate a type alias with the possible values;
 * - `upper` for an enum with UPPER_CASE names, and;
 * - `pascal` for enum PascalCase names. Defaults to 'pascal'.
 */
export enum EnumStyle {
    Alias = "alias",
    Pascal = "pascal",
    Upper = "upper",
}

/**
 * Determines if the environment is local, test or production.Used in conjunction with
 * apiName, if composeUrlFromApiName is true, to compose the file spec url based on the name
 * witt the form `https://${apiName}-api-${environment}/swagger/v1/swagger.json`
 */
export enum Environment {
    Local = "local",
    Production = "production",
    Test = "test",
}
