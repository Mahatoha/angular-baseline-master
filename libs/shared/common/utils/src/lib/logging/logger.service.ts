/* eslint-disable no-console */
import { inject, InjectionToken, Service } from "@angular/core";

export const IS_PROD_MODE: InjectionToken<boolean> = new InjectionToken("isProduction");

@Service()
export class LoggerService {
    private readonly isProduction: boolean = inject(IS_PROD_MODE);

    public log(msg: unknown, ...args: Array<unknown>): void {
        if (!this.isProduction) {
            console.log(msg, ...args);
        }
    }

    public warn(msg: unknown): void {
        if (!this.isProduction) {
            console.warn(msg);
        }
    }

    public error(msg: unknown): void {
        if (!this.isProduction) {
            console.error(msg);
        }
    }

    public debug(msg: unknown, ...args: Array<unknown>): void {
        if (!this.isProduction) {
            console.debug(msg, ...args);
        }
    }
}
