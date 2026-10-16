import { Service } from "@angular/core";

@Service()
export class ModuleLoadedService {
    public readonly loadedModulesMap: Map<string, boolean> = new Map();

    public isModuleLoaded(moduleName: string): boolean {
        return this.loadedModulesMap.get(moduleName) === true;
    }
}
