import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi, withXhr } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { AUTH_CONFIG, OAuthResourceServerErrorHandler, OAuthService } from "angular-oauth2-oidc";
import { timeout } from "rxjs";

import { OAUTH_INTERCEPTOR_URL_REGEX } from "../../models";
import { UserService } from "../../+state/authenticated-user/_internal/authenticated-user.service";
import { OAuthInterceptor } from "./authentication.interceptor";

const OAuthServiceMock = {
    getAccessToken: jest.fn(),
    configure: jest.fn(),
};

const OAuthResourceServerErrorHandlerMock = {
    handleError: jest.fn(),
};

const UserServiceMock = {
    setUser: jest.fn(),
};

const AuthConfigMock = {};

const OauthInterceptorUrlRegexMock = /ws-my-app|assets\/app-config(\.\w+)?.json/;

describe("OAuthInterceptor", () => {
    let client: HttpClient;
    let controller: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withXhr(), withInterceptorsFromDi()),
                provideHttpClientTesting(),
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: OAuthInterceptor,
                    multi: true,
                },
                {
                    provide: OAuthService,
                    useValue: OAuthServiceMock,
                },
                {
                    provide: OAuthResourceServerErrorHandler,
                    useValue: OAuthResourceServerErrorHandlerMock,
                },
                {
                    provide: AUTH_CONFIG,
                    useValue: AuthConfigMock,
                },
                {
                    provide: UserService,
                    useValue: UserServiceMock,
                },
                {
                    provide: OAUTH_INTERCEPTOR_URL_REGEX,
                    useValue: OauthInterceptorUrlRegexMock,
                },
            ],
        });

        client = TestBed.inject(HttpClient);
        controller = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it.each([
        {
            condition:
                "should not add Authorization header if requesting API other than the ones specified in OAUTH_INTERCEPTOR_URL_REGEX",
            urlToCall: "/test",
            expectedHeader: null,
        },
        {
            condition:
                "should add Authorization header if requesting API matching the ones specified in OAUTH_INTERCEPTOR_URL_REGEX",
            urlToCall: "/ws-my-app/test",
            expectedHeader: "Bearer a1z2e3",
        },
        {
            condition: "should not add Authorization header if requesting base configuration file",
            urlToCall: `/assets/app-config.json?${new Date().getTime()}`,
            expectedHeader: null,
        },
        {
            condition: "should not add Authorization header if requesting env configuration file",
            urlToCall: `/assets/app-config.myenv.json?${new Date().getTime()}`,
            expectedHeader: null,
        },
    ])("$inputParameters.condition", (inputParameters, done) => {
        // Arrange
        jest.spyOn(OAuthServiceMock, "getAccessToken").mockReturnValue("a1z2e3");

        // Act
        client
            .get(inputParameters.urlToCall)
            .pipe(timeout(1))
            .subscribe({
                error: () => {
                    // Assert
                    const get = controller.expectOne(inputParameters.urlToCall);

                    expect(get.request.headers.get("Authorization")).toEqual(inputParameters.expectedHeader);
                    done();
                },
            });
    });
});
