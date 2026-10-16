// Devkit
import { addDependenciesToPackageJson, GeneratorCallback, Tree } from "@nx/devkit";

// Utils
import { openapiGeneratorVersion } from "../utils/versions";

//  this function is here to be called before any generator to ensure the required package are installed in dev-deps
//  now it's just called before openApi client generator
// eslint-disable-next-line @typescript-eslint/require-await
export default async function (tree: Tree): Promise<GeneratorCallback> {
    // Add ng-openapi-gen to dev dependencies
    return addDependenciesToPackageJson(tree, {}, { "ng-openapi-gen": openapiGeneratorVersion });
}
