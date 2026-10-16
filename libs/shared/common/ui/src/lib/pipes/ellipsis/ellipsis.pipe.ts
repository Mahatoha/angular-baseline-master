import { Pipe, PipeTransform } from "@angular/core";

const MAX_CHAR: number = 40;

@Pipe({ name: "ellipsis" })
export class EllipsisPipe implements PipeTransform {
    public transform(value: string, maxChar: number = MAX_CHAR, suffix?: string | null): string {
        suffix ??= "...";
        if (value.length > maxChar) {
            return value.slice(0, maxChar) + suffix;
        }
        return value;
    }
}
