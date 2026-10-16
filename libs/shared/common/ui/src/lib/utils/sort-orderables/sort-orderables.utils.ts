export interface Orderable {
    order?: number | null;
}

export function sortOrderables(aCmp: Orderable, bCmp: Orderable): number {
    const aOrder: number = aCmp.order ?? Number.MAX_VALUE;
    const bOrder: number = bCmp.order ?? Number.MAX_VALUE;

    return aOrder - bOrder;
}
