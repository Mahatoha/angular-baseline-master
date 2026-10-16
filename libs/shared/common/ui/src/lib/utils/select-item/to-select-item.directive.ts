import { Directive, inject, Input } from "@angular/core";

import { toSelectItems } from "@gestion-acte/utils";
import { SelectItem } from "@openng/optimus-ui/api";
import { MultiSelect } from "@openng/optimus-ui/multiselect";
import { Select } from "@openng/optimus-ui/select";

/** Directive qui permet de transformer les options passés à un composant primeNG en liste de {@link SelectItem} */
@Directive({
    selector: "p-select[gaToSelectItems], p-multiSelect[gaToSelectItems]",
})
export class ToSelectItemsDirective<T> {
    private readonly dropDownCmp: Select | null = inject(Select, { optional: true, self: true });
    private readonly multiSelectCmp: MultiSelect | null = inject(MultiSelect, { optional: true, self: true });

    /**
     * Liste d'options à transformer en liste de {@link SelectItem}
     */
    @Input() public set options(options: Array<T>) {
        this.mapOptionsToSelectItems(options);
    }

    /**
     * Propriété de l'objet "T" contenu dans la liste d'[options]{@link ToSelectItemsDirective#options} permettant d'identifier ce qui qui sera utilisé
     * comme label lors de la transformation en {@link SelectItem}
     */
    @Input() public labelProperty?: keyof T;

    /**
     * Composant primeNG hôte de la directive.
     */
    public readonly selfPopulatedCmp: Select | MultiSelect;

    constructor() {
        const populatedCmp: Select | MultiSelect | null = this.dropDownCmp ?? this.multiSelectCmp;

        if (populatedCmp === null) {
            throw new Error("You've applied the to select items directive on an invalid component");
        }

        this.selfPopulatedCmp = populatedCmp;
    }

    private mapOptionsToSelectItems(options: Array<T>): void {
        const opts: Array<SelectItem<T>> = toSelectItems(options, this.labelProperty);
        this.selfPopulatedCmp.options = opts;
    }
}
