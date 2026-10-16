import { inject, Pipe, PipeTransform } from "@angular/core";

import { REFERENTIAL_HUMANIZER, ReferentialHumanizer } from "@gestion-acte/domain";

/**
 * Permet d'afficher le label d'un objet du référentiel
 * en fonction de son code.
 *
 * La recherche est effectué dans le store du [référentiel injecté]{@link REFERENTIAL_HUMANIZER}.
 */
@Pipe({ name: "humanizeReferentiel" })
export class HumanizeReferentielPipe<T> implements PipeTransform {
    private readonly referentialHumanizer: ReferentialHumanizer<T> = inject(REFERENTIAL_HUMANIZER);

    public transform(code: string, type: T): string {
        return this.referentialHumanizer.humanizeReferential(code, type) ?? code;
    }
}
