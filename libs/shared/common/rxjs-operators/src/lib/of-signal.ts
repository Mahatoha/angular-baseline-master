import { defer, Observable, of } from "rxjs";
import { ignoreElements } from "rxjs/operators";

export function ofSignal(signal: () => void): Observable<never> {
    return defer(() => of(signal())).pipe(ignoreElements());
}
