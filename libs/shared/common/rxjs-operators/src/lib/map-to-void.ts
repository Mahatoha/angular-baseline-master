import { OperatorFunction } from "rxjs";
import { map } from "rxjs/operators";

export function mapToVoid<T>(): OperatorFunction<T, void> {
    return (source) => source.pipe(map(() => void 0));
}
