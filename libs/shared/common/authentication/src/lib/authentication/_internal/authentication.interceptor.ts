import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from "@angular/common/http";
import { inject, Service } from "@angular/core";

import { OAuthResourceServerErrorHandler } from "angular-oauth2-oidc";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

import { AuthenticationService } from "./authentication.service";
import { OAUTH_INTERCEPTOR_URL_REGEX } from "../../models";

@Service({ autoProvided: false })
export class OAuthInterceptor implements HttpInterceptor {
    private readonly authenticationService: AuthenticationService = inject(AuthenticationService);
    private readonly errorHandler: OAuthResourceServerErrorHandler = inject(OAuthResourceServerErrorHandler);
    private readonly urlRegex: string = inject(OAUTH_INTERCEPTOR_URL_REGEX);

    public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const url: string = request.url.toLowerCase();
        if (/assets\/app-config(\.\w+)?.json/.test(url) || !new RegExp(this.urlRegex).test(url)) {
            return next.handle(request);
        }

        const token: string = this.authenticationService.getAccessToken();

        if (token.length > 0) {
            const header: string = "Bearer " + token;
            const headers: HttpHeaders = request.headers.set("Authorization", header);
            request = request.clone({ headers });
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return next.handle(request).pipe(catchError((err) => this.errorHandler.handleError(err)));
    }
}
