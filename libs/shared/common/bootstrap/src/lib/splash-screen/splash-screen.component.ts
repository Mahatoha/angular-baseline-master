import { Component, input, InputSignal } from "@angular/core";

@Component({
    selector: "abm-splash-screen",
    templateUrl: "./splash-screen.component.html",
    styleUrls: ["./splash-screen.component.scss"],
})
export class SplashScreenComponent {
    public readonly appTitleSnl: InputSignal<string> = input<string>("", { alias: "appTitle" });
}
