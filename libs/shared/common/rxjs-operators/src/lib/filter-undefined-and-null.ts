import { OperatorFunction } from "rxjs";
import { filter } from "rxjs/operators";

function isNotUndefinedOrNull<T>(input: undefined | null | T): input is T {
    return input !== undefined && input !== null;
}

export function filterUndefinedAndNull<T>(): OperatorFunction<undefined | null | T, T> {
    return (source) => source.pipe(filter(isNotUndefinedOrNull));
}
