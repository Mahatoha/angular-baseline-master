import { createHash } from "crypto";

// eslint-disable-next-line import/no-internal-modules
import { libraryGenerator } from "@nx/angular/generators";
import {
    Tree,
    formatFiles,
    installPackagesTask,
    joinPathFragments,
    names,
    getProjects,
    logger,
    writeJson,
} from "@nx/devkit";

import { OpenAPIConfig } from "./schema";
import init from "../init/generator";
import { generateOpenApiClient } from "../utils/generateOpenApi";
import { getProjectName, getProjectRoot, getProjectSourceRoot, visitAllFiles } from "../utils/helpers";

interface CustomSchema {
    name: string;
    skipFormat: boolean;
    simpleModuleName: boolean;
    addModuleSpec?: boolean;
    directory: string;
    importPath?: string;
    standaloneConfig?: boolean;
    tags?: string;
    strict?: boolean;
    buildable: boolean;
    publishable: boolean;
    projectName: string;
    forceRemove: boolean;
}

export async function openApiClientGenerator(host: Tree, config: OpenAPIConfig): Promise<() => void> {
    await init(host);

    const apiName: {
        name: string;
        className: string;
        propertyName: string;
        constantName: string;
        fileName: string;
    } = names(config.apiName);

    const configurationClassName: string = `${apiName.className}ApiConfiguration`;

    const configObject: OpenAPIConfig = {
        apiService: `${apiName.className}Api`,
        baseService: `${apiName.className}BaseService`,
        configuration: configurationClassName,
        importPath: `@shared/apis/${apiName.fileName}`,
        indexFile: true,
        serviceIndex: `${apiName.fileName}-services`,
        isRemoteSpec: true,
        modelIndex: `${apiName.fileName}-models`,
        requestBuilder: `${apiName.className}RequestBuilder`,
        ...config,
        $schema: "node_modules/ng-openapi-gen/ng-openapi-gen-schema.json",
    };

    const realSchema: CustomSchema = {
        name: config.apiName,
        directory: joinPathFragments("shared", "apis"),
        skipFormat: true,
        importPath: configObject.importPath,
        simpleModuleName: true,
        standaloneConfig: true,
        tags: "scope:common,scope:shared,type:data-access",
        strict: false,
        buildable: false,
        publishable: false,
        forceRemove: true,
        projectName: getProjectName({
            name: config.apiName,
            directory: joinPathFragments("shared", "apis"),
        }),
    };

    const libraryExists: boolean = getProjects(host).has(realSchema.projectName);

    if (!libraryExists) {
        await libraryGenerator(host, realSchema);
    }

    const root: string = getProjectRoot(host, realSchema);
    host.delete(joinPathFragments(root, "eslint.config.mjs"));
    const sourceRoot: string = getProjectSourceRoot(host, realSchema);

    const apiGenPath: string = joinPathFragments("dist", "api");
    const apiGenLibPath: string = joinPathFragments(apiGenPath, "lib");

    const indexPath: string = joinPathFragments(sourceRoot, "index.ts");
    host.write(indexPath, 'export * from "./lib";');

    const jsonConfigName: string = joinPathFragments(sourceRoot, `${apiName.fileName}-config.json`);
    writeJson<OpenAPIConfig>(host, jsonConfigName, configObject);
    // générer le client
    await generateOpenApiClient(config.baseUrl, apiGenLibPath, jsonConfigName, libraryExists);

    const apiLibPath: string = joinPathFragments(sourceRoot, "lib");

    visitAllFiles(host, apiLibPath, (filePath) => host.delete(filePath)); // Déplacements des fichiers
    visitAllFiles(host, apiGenLibPath, (filePath) => {
        host.write(filePath.replace(apiGenLibPath, apiLibPath), host.read(filePath)?.toString() ?? "");
    });

    // renameOpenApiFnFiles(host, apiLibPath);

    host.write(
        joinPathFragments(sourceRoot, `${apiName.fileName}-config.json`),
        host.read(jsonConfigName)?.toString() ?? ""
    );

    const libIndexPath: string = joinPathFragments(sourceRoot, "lib", "index.ts");
    const content: string = host.read(libIndexPath)?.toString() ?? "";

    if (content.length > 0) {
        const configurationFileName: string = `${apiName.fileName}-api-configuration`;

        let updatedContent: string = content.replace(
            `export { ${configurationClassName} } from './${configurationFileName}';`,
            `export * from './${configurationFileName}';`
        );

        updatedContent = applyExportFixes(updatedContent, configObject.apiService ?? "Api", apiName.fileName);
        host.write(libIndexPath, updatedContent);
    }

    /*     const moduleFileName: string = `${apiName.fileName}-api.module.ts`;
    const libModuleIndexPath: string = joinPathFragments(sourceRoot, "lib", moduleFileName);
    const moduleContent: string = host.read(libModuleIndexPath)?.toString() ?? "";
    let updatedModule: string = moduleContent.replace(/providers:\s*\[\s*([\w\s,]+)\s*\]/, "providers: []"); */
    // updatedModule = updatedModule.replace(/^.*Service.*/gm, "");

    // host.write(libModuleIndexPath, updatedModule); */

    await formatFiles(host);
    return () => {
        installPackagesTask(host);
    };
}

function applyExportFixes(content: string, toExport: string, exportFrom: string): string {
    return fixExportFromApi(fixExportFromFunctions(content), toExport, exportFrom);
}

function fixExportFromFunctions(content: string): string {
    const importFunction: string = "export * from './functions';";
    if (!content.includes(importFunction)) {
        const clearedRows: Array<string> = content.split("\n").filter((row) => !row.includes("./fn/"));
        const clearedContent: string = clearedRows.join("\n");
        return clearedContent + "\n" + importFunction;
    }
    return content;
}

function fixExportFromApi(content: string, toExport: string, exportFrom: string): string {
    const importApi: string = `export { ${toExport} } from './${exportFrom}-api';`;
    if (!content.includes(importApi)) {
        return content + "\n" + importApi;
    }
    return content;
}

function renameOpenApiFnFiles(host: Tree, apiPath: string): void {
    const apiFnPath: string = joinPathFragments(apiPath, "fn");
    const updatedFnNames: Map<string, string> = new Map<string, string>();

    const fileNameRegex: RegExp = /^(.*[\\/])(.+)(\..+)$/;
    visitAllFiles(host, apiFnPath, (currentPath) => {
        const [, filePath = "", fileName = "", fileExtention = ""] = fileNameRegex.exec(currentPath) ?? [];

        const hash: string = createHash("sha1").update(fileName).digest("hex");
        const updatedPath: string = `${joinPathFragments(filePath, hash)}${fileExtention}`;
        host.rename(currentPath, updatedPath);
        logger.log("Renaming file", currentPath, "=>", updatedPath);

        const relativePath: string = filePath.replace(apiPath, "..");
        updatedFnNames.set(
            `'${joinPathFragments(relativePath, fileName)}'`,
            `'${joinPathFragments(relativePath, hash)}'`
        );
    });

    if (updatedFnNames.size > 0) {
        const apiSetvicePath: string = joinPathFragments(apiPath, "services");
        visitAllFiles(host, apiSetvicePath, (currentPath) => {
            let fileContent: string = host.read(currentPath)?.toString() ?? "";
            updatedFnNames.forEach((newPath, oldPath) => {
                fileContent = fileContent.replaceAll(oldPath, newPath);
            });
            host.write(currentPath, fileContent);
        });
    }
}

export default openApiClientGenerator;
