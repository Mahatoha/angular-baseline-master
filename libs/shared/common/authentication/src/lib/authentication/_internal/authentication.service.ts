import { inject, Service } from "@angular/core";

import { AUTH_CONFIG, AuthConfig, OAuthService } from "angular-oauth2-oidc";
import { from, map, Observable, of } from "rxjs";

import { UserService } from "../../+state/authenticated-user/_internal/authenticated-user.service";
import { AuthenticatedUser, LOGIN_ROUTE, LOGOUT_ROUTE } from "../../models";
import { AppClaims } from "../../models/_internal/app-claims.model";

const DEFAULT_CLOCK_SKEW_IN_SEC: number = 10;

@Service()
export class AuthenticationService {
    private readonly oAuthService: OAuthService = inject(OAuthService);
    private readonly userService: UserService = inject(UserService);
    private readonly authConfig: AuthConfig = inject(AUTH_CONFIG);

    constructor() {
        this.configureOAuthService(this.authConfig);
    }

    private static normalize(authConfig: AuthConfig): void {
        const { logoutUrl } = authConfig;
        const origin: string = window.location.origin;

        authConfig.redirectUri = origin + LOGIN_ROUTE;
        authConfig.postLogoutRedirectUri = origin + LOGOUT_ROUTE;
        authConfig.silentRefreshRedirectUri = origin + "/silent-refresh.html";

        if (logoutUrl === "origin") authConfig.logoutUrl = window.location.origin;

        authConfig.clockSkewInSec ??= DEFAULT_CLOCK_SKEW_IN_SEC;
    }

    public tryLogin(): Observable<false | string> {
        return from(this.oAuthService.loadDiscoveryDocumentAndTryLogin()).pipe(
            map((isLogged) => {
                const isAuthenticated: boolean = isLogged && this.isAuthenticationValid();
                const requestedUri: string = decodeURIComponent(this.oAuthService.state ?? "");

                return isAuthenticated && requestedUri;
            })
        );
    }

    public getAccessToken(): string {
        return this.oAuthService.getAccessToken();
    }

    public isLogged(): boolean {
        return this.oAuthService.hasValidAccessToken();
    }

    public initLoginFlow(requestedUri: string): void {
        this.oAuthService.initCodeFlow(requestedUri);
    }

    public trySetUser(): Observable<boolean> {
        return this.tryLoadDiscoveryDocument().pipe(
            map((isLoaded) => {
                if (isLoaded) {
                    this.oAuthService.setupAutomaticSilentRefresh();
                    this.setUserAndClaims();
                    return true;
                }
                return false;
            })
        );
    }

    public logout(resetStore: boolean = true): void {
        if (resetStore) {
            // TODO manage stores reset
            // resetStores();
        }
        this.oAuthService.revokeTokenAndLogout();
    }

    private setUserAndClaims(): void {
        const authenticatedUser: AuthenticatedUser = this.getAuthenticatedUser();
        this.userService.setUser(authenticatedUser);
    }

    private configureOAuthService(authConfig: AuthConfig): void {
        AuthenticationService.normalize(authConfig);
        this.oAuthService.configure(authConfig);
    }

    private tryLoadDiscoveryDocument(): Observable<boolean> {
        if (!this.oAuthService.discoveryDocumentLoaded) {
            return this.loadDiscoveryDocument();
        }
        return of(true);
    }

    private loadDiscoveryDocument(): Observable<boolean> {
        return from(this.oAuthService.loadDiscoveryDocument()).pipe(map((e) => e.type === "discovery_document_loaded"));
    }

    private isAuthenticationValid(): boolean {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        return this.oAuthService.hasValidAccessToken() && this.oAuthService.getIdentityClaims() !== null;
    }

    private getClaims<T>(): T {
        return this.oAuthService.getIdentityClaims() as unknown as T;
    }

    private getAuthenticatedUser(): AuthenticatedUser {
        const claims: AppClaims = this.getClaims<AppClaims>();
        return this.mapToAuthenticatedUser(claims);
    }

    private mapToAuthenticatedUser(claims: AppClaims): AuthenticatedUser {
        return {
            ...claims,
            familyName: claims.family_name,
            givenName: claims.given_name,
        };
    }
}
