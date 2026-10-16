import { Query, Store } from "@datorama/akita";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class AbstractQuery<S = any> {
    private readonly internalQuery: Query<S>;

    constructor(protected readonly store: Store<S>) {
        this.internalQuery = new Query<S>(store);
    }

    protected get query(): Query<S> {
        return this.internalQuery;
    }
}
