import { Component, OnInit, inject } from "@angular/core";
import { RouterLink } from "@angular/router";

import { AuthenticationService } from "../_internal/authentication.service";

@Component({
    selector: "ga-logout",
    templateUrl: "./logout.component.html",
    styleUrls: ["./logout.component.scss"],
    imports: [RouterLink],
})
export class LogoutComponent implements OnInit {
    private readonly authenticationService: AuthenticationService = inject(AuthenticationService);

    public ngOnInit(): void {
        this.disconnect();
    }

    private disconnect(): void {
        this.authenticationService.logout(true);
    }
}
