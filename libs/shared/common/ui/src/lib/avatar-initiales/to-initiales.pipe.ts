import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "toInitiales",
})
export class ToInitialesPipe implements PipeTransform {
    public transform(firstWord: string | null | undefined, ...otherWords: Array<string | null | undefined>): string {
        const words: Array<string | null | undefined> = [firstWord, ...otherWords];
        return words.map((word) => word?.toUpperCase()[0] ?? "").join("");
    }
}
