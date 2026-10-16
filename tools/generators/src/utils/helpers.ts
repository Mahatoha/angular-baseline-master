import { names, readProjectConfiguration, Tree } from "@nx/devkit";

export function getProjectSourceRoot(tree: Tree, options: { name: string; directory: string }): string {
    const sourceRoot: string | undefined = readProjectConfiguration(tree, getProjectName(options)).sourceRoot;
    if (sourceRoot === undefined || sourceRoot.length === 0) {
        throw new Error("Project source root not found");
    }
    return sourceRoot;
}

export function getProjectRoot(tree: Tree, options: { name: string; directory: string }): string {
    const root: string = readProjectConfiguration(tree, getProjectName(options)).root;
    if (root.length === 0) {
        throw new Error("Project root not found");
    }
    return root;
}

export function getProjectName(options: { name: string; directory: string }): string {
    const name: string = names(options.name).fileName;
    const projectDirectory: string =
        options.directory.length > 0 ? `${names(options.directory).fileName}/${name}` : name;

    return projectDirectory.replace(new RegExp("/", "g"), "-");
}

export function visitAllFiles(tree: Tree, path: string, callback: (filePath: string) => void): void {
    tree.children(path).forEach((fileName) => {
        const filePath: string = `${path}/${fileName}`;
        if (!tree.isFile(filePath)) {
            visitAllFiles(tree, filePath, callback);
        } else {
            callback(filePath);
        }
    });
}
