import { OperatorFunction } from "rxjs";
import { filter } from "rxjs/operators";

function isNotUndefined<T>(input: undefined | T): input is T {
    return input !== undefined;
}

export function filterUndefined<T>(): OperatorFunction<undefined | T, T> {
    return (source) => source.pipe(filter(isNotUndefined));
}
