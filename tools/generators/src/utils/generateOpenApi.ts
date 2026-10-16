import { ChildProcess } from "child_process";
import * as path from "path";
import * as process from "process";

import { logger } from "@nx/devkit";
import { spawn } from "cross-spawn";
import * as rimraf from "rimraf";
import { from, lastValueFrom, of } from "rxjs";
import { map, catchError } from "rxjs/operators";

export async function generateOpenApiClient(
    swaggerUrl: string,

    outputPath: string,
    openApiConfig: string,
    removeOldDirectoryCode: boolean
): Promise<{ success: boolean }> {
    return lastValueFrom<{ success: boolean }>(
        from(generateSources(swaggerUrl, outputPath, openApiConfig, removeOldDirectoryCode)).pipe(
            map(() => ({ success: true })),
            catchError((error) => {
                logger.error(error);
                return of(error);
            })
        )
    );
}

function generateSources(
    swaggerUrl: string,
    outputPath: string,
    openApiConfig: string,
    removeOldDirectoryCode: boolean
): Promise<number> {
    return new Promise((resolve, reject) => {
        if (removeOldDirectoryCode) rimraf.sync(outputPath);
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

        const fullPath: string = path.resolve("./node_modules/.bin/ng-openapi-gen");

        const child: ChildProcess = spawn(`${fullPath} -i ${swaggerUrl} -o ${outputPath} -c ${openApiConfig}`, {
            stdio: "inherit",
            shell: true,
        });

        child.on("error", (err: unknown) => {
            reject(err);
        });
        child.on("exit", (code: number | PromiseLike<number>) => {
            if (code === 0) {
                resolve(code);
            } else {
                reject(code);
            }
        });
    });
}
