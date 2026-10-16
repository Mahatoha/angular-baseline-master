import { InjectionToken } from "@angular/core";

import { Observable } from "rxjs";

export interface ActionNotifier {
    onChange: (action: string, entityId?: number) => Observable<boolean>;
}
export const ACTION_NOTIFIER: InjectionToken<ActionNotifier> = new InjectionToken("actionNotifier");
