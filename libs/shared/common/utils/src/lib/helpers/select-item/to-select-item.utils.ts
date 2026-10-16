import { SelectItem } from "./select-item.model";

/**
 * Transforme le tableau reçu en entrée en tableau de {@link SelectItem}
 *
 * @param items Tableau à mapper vers l'interface {@link SelectItem}
 * @param labelProperty Propriété permettant d'identifier la clé à utiliser pour définir le label lorsque le tableau est un tableau d'objets.
 * @returns Un nouveau tableau présentant la donnée reçu sous forme de {@link SelectItem}
 */
export function toSelectItems<T>(items: Array<T>, labelProperty?: keyof T): Array<SelectItem<T>> {
    return items.map((item) => toSelectItem(item, labelProperty));
}

/**
 * Transforme la donnée reçue en entrée en {@link SelectItem}
 *
 * @param item Objet ou primitive à mapper vers l'interface {@link SelectItem}
 * @param labelProperty Propriété permettant d'identifier la clé à utiliser pour définir le label lorsque l'item est un objet.
 * @returns La donnée reçu sous forme de {@link SelectItem}
 */
export function toSelectItem<T>(item: T, labelProperty?: keyof T): SelectItem<T> {
    let label: unknown = item;

    if (typeof item === "object" && item != null && labelProperty != null) {
        label = item[labelProperty];
    } else if (typeof item === "number") {
        label = item.toString();
    }

    if (typeof label !== "string") {
        throw new Error("Veuillez choisir une propriété de type string pour définir le label.");
    }

    return { label, value: item };
}
