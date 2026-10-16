import { HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { Router } from "@angular/router";

import { catchFrontEndError, HandledError } from "@gestion-acte/rxjs-operators";
import { MessageService } from "@openng/optimus-ui/api";
import { catchError, from, MonoTypeOperatorFunction, Observable } from "rxjs";

interface BusinessError extends HttpErrorResponse {
    error: { businessMessages: Array<string> };
}

interface ProblemDetailsError extends HttpErrorResponse {
    error: { detail: string };
}

const ERROR_PATH: Array<string> = ["erreur-application"];

@Service()
export class FrontEndErrorService {
    private readonly messageService: MessageService = inject(MessageService);
    private readonly router: Router = inject(Router);

    public catch<T>(frontEndMessage: string): MonoTypeOperatorFunction<T> {
        return (source) => source.pipe(catchFrontEndError((err) => this.handle(frontEndMessage, err)));
    }

    // TODO:  Watch out if it's necessary to handle technical error with message code
    public handle(frontEndMessage: string, error?: unknown): void {
        if (error == null || error === "") return;
        let detail: string = "";
        if (typeof error === "string") {
            detail = error;
        } else if (error instanceof Error) {
            detail = error.message;
        } else if (error instanceof HttpErrorResponse) {
            const parsedError: HttpErrorResponse = this.getParsedHttpErrorResponse(error);
            if (this.isBusinessError(parsedError)) {
                detail = parsedError.error.businessMessages.join(" ");
            } else if (this.isProblemDetailsError(parsedError)) {
                detail = parsedError.error.detail;
            } else {
                detail = error.message;
            }
        }

        console.error(detail);
        this.messageService.add({
            severity: "error",
            summary: frontEndMessage,
            detail,
            life: 4000,
        });
    }

    public catchAndRedirect<T>(
        redirections?: Map<HttpStatusCode, Array<unknown>>
    ): MonoTypeOperatorFunction<T | boolean> {
        return (source) => source.pipe(catchError((err) => this.handleRedirect(redirections, err)));
    }

    public handleRedirect(redirections?: Map<HttpStatusCode, Array<unknown>>, error?: unknown): Observable<boolean> {
        const errorToCheck: unknown = error instanceof HandledError ? error.error : error;

        if (errorToCheck instanceof HttpErrorResponse) {
            return from(this.router.navigate(redirections?.get(errorToCheck.status) ?? ERROR_PATH));
        }
        return from(this.router.navigate(ERROR_PATH));
    }

    private isBusinessError(error: HttpErrorResponse): error is BusinessError {
        const isBusinessError: boolean =
            error.error != null && Object.prototype.hasOwnProperty.call(error.error, "businessMessages");
        return isBusinessError;
    }

    private isProblemDetailsError(error: HttpErrorResponse): error is ProblemDetailsError {
        const isProblemDetailsError: boolean =
            error.error != null && Object.prototype.hasOwnProperty.call(error.error, "detail");
        return isProblemDetailsError;
    }

    private getParsedHttpErrorResponse(error: HttpErrorResponse): HttpErrorResponse {
        return typeof error.error === "string" ? { ...error, error: JSON.parse(error.error) } : error;
    }
}
