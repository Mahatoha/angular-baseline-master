import { enableProdMode } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";

import { enableAkitaProdMode } from "@datorama/akita";
import { AppConfigInitService } from "@gestion-acte/configuration";
import { AppConfig } from "@shared/usagers/configuration";

import { AppHostComponent } from "./app/app-host.component";
import { buildApplicationConfig } from "./app/app.config";
import { environment } from "./environments/environment";

if (environment.production) {
    enableProdMode();
    enableAkitaProdMode();
}

AppConfigInitService.buildAppConfig<AppConfig>(environment.production)
    .then((appConfig) => bootstrapApplication(AppHostComponent, buildApplicationConfig(appConfig)))
    .catch((err) => console.error(err));
