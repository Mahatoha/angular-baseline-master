import { Directive, Signal, viewChild } from "@angular/core";

import { Table } from "@openng/optimus-ui/table";

/**
 * Classe de Base pour les composants qui contiennent une table PrimeNG.
 * Contient les fonctionnalités basique de management de la sélection multiple
 * ainsi qu'une fonction trackBy.
 */
@Directive()
export abstract class GestionActeDataTable<T extends { id: number }> {
    /**
     * Référence sur l'instance de {@link Table} contenu dans le template.
     */
    public dataTableSnl: Signal<Table | undefined> = viewChild(Table);

    /**
     * Entités actuellement sélectionnées dans la table.
     */
    public selection: Array<T> = [];

    /**
     * Permet de mettre à jour le tableau de [selection]{@link GestionActeDataTable#selection}
     * de la table.
     *
     * @param entity L'entité à sélectionner ou déselectionner en fonction du top actif/inactif.
     * @param isActive Statut de la sélection (actif/inactif).
     */
    public toggleSelectedRow(entity: T, isActive: boolean): void {
        if (isActive) {
            this.selection = [...this.selection, entity];
        } else {
            const rowIndex: number = this.selection.findIndex((ta) => ta.id === entity.id);
            this.selection = this.selection.slice(0, rowIndex).concat(this.selection.slice(rowIndex + 1));
        }
    }

    /**
     * Implémentation basique de trackBy pour optimiser la génération
     * du HTML via la directive NgForOf.
     *
     * @param _ Index du row renvoyé par NgForOf - non utilisé.
     * @param entity L'entité correspondant au row renvoyé par NgForOf
     * @returns L'id de l'entité nécessaire pour le tracking
     */
    public trackById(_: number, entity: T): number {
        return entity.id;
    }

    /**
     * Permet de reset la sélection courante de la table.
     */
    protected resetSelectedRows(): void {
        const dataTable: Table | undefined = this.dataTableSnl();
        if (dataTable !== undefined) {
            dataTable.expandedRowKeys = {};
            this.selection = [];
        }
    }
}
