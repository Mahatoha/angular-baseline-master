import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "isSubstring" })
export class IsSubstringPipe implements PipeTransform {
    public transform(part: string, source: string | null): boolean {
        return source?.includes(part) ?? false;
    }
}
