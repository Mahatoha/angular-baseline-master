import { OperatorFunction } from "rxjs";
import { map } from "rxjs/operators";

export function mapArray<T, R>(
    project: (value: T, index: number) => R,
    thisArg?: unknown
): OperatorFunction<Array<T>, Array<R>> {
    return (source) => source.pipe(map((x) => x.map((value, index) => project(value, index)), thisArg));
}
