import { Location } from "@angular/common";
import { TestBed } from "@angular/core/testing";
import { provideRouter, Router, UrlTree } from "@angular/router";

import { OAuthService } from "angular-oauth2-oidc";
import { of } from "rxjs";

import { AuthenticationService } from "./_internal/authentication.service";
import { AuthenticationGuard } from "./authentication.guard";
import { LoginComponent } from "./login/login.component";
import { LOGIN_ROUTE } from "../models";

const authenticationServiceMock = {
    isLogged: jest.fn(),
    trySetUser: jest.fn(),
};

const OAuthServiceMock = {
    getAccessToken: jest.fn(),
};

describe("LoggedInGuard", () => {
    let guard: AuthenticationGuard;
    let router: Router;
    let location: Location;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthenticationGuard,
                // { provide: Router, useValue: routerMock },
                { provide: AuthenticationService, useValue: authenticationServiceMock },
                {
                    provide: OAuthService,
                    useValue: OAuthServiceMock,
                },
                provideRouter([
                    {
                        path: LOGIN_ROUTE.startsWith("/") ? LOGIN_ROUTE.replace("/", "") : LOGIN_ROUTE,
                        component: LoginComponent,
                    },
                ]),
            ],
        });
        guard = TestBed.inject(AuthenticationGuard);
        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should be able to navigate when logged in", (done) => {
        // Arrange
        jest.spyOn(authenticationServiceMock, "isLogged").mockReturnValue(true);
        jest.spyOn(authenticationServiceMock, "trySetUser").mockReturnValue(of(true));

        // Act
        guard.canActivate().subscribe((res) => {
            // Assert
            expect(res).toBe(true);
            done();
        });
    });

    it("should not be able to activate when logged in", (done) => {
        // Arrange
        jest.spyOn(authenticationServiceMock, "isLogged").mockReturnValue(false);
        const parseUrlSpy = jest.spyOn(router, "parseUrl");

        // Act
        guard.canActivate().subscribe((res) => {
            // Assert
            expect(res).toBeInstanceOf(UrlTree);
            const expectedCallUrl: string = `${LOGIN_ROUTE}?redirectUri=${location.path()}`;
            expect(parseUrlSpy).toHaveBeenCalledWith(expectedCallUrl);
            done();
        });
    });
});
