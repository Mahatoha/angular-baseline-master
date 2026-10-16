import { EntityState, QueryEntity, EntityStore, QueryConfigOptions } from "@datorama/akita";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class AbstractEntityQuery<S extends EntityState = any> {
    private readonly internalQuery: QueryEntity<S>;

    constructor(
        protected readonly store: EntityStore<S>,
        queryConfig?: QueryConfigOptions
    ) {
        this.internalQuery = new QueryEntity<S>(store, queryConfig);
    }

    protected get query(): QueryEntity<S> {
        return this.internalQuery;
    }
}
