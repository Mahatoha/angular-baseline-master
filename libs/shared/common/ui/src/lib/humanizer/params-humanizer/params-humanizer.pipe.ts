import { Pipe, PipeTransform, inject } from "@angular/core";

import { PARAMS_HUMANIZER, ParamsHumanizer, ParamsHumanizerFn } from "@gestion-acte/domain";

/**
 * Pipe permettant de transformer la valeur passée en entrée en un libellé en se basant sur la fonction de transformation passée en paramètre ou une fonction parmi celles injectées dans le constructeur.
 */
@Pipe({ name: "paramsHumanizer" })
export class ParamsHumanizerPipe implements PipeTransform {
    private readonly paramsHumanizer: ParamsHumanizer | null = inject(PARAMS_HUMANIZER, { optional: true });

    /**
     * Transforme la valeur en entrée en un libellé en se basant sur une fonction de transformation parmi celles injectées dans le constructeur ou directement passée en paramètre.
     * @param value la valeur à transformer
     * @param humanizer la clé de la méthode de transformation à utiliser (récupérée parmi celles injectées dans une map dans le constructeur) ou directement la méthode de transformation à utiliser
     * @returns Le libellé transformé
     */
    public transform(value: string, humanizer: string | ParamsHumanizerFn): string {
        const humanizeFn: ParamsHumanizerFn | undefined =
            typeof humanizer === "string" ? this.getHumanizeFn(humanizer) : humanizer;

        if (humanizeFn !== undefined) {
            return humanizeFn(value);
        }

        return value;
    }

    private getHumanizeFn(paramKey: string): ParamsHumanizerFn | undefined {
        return this.paramsHumanizer?.humanizerMap.get(paramKey);
    }
}
