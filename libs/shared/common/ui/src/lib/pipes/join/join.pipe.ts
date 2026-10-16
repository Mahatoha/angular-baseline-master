import { Pipe, PipeTransform } from "@angular/core";

import { TextUtils } from "@gestion-acte/utils";

@Pipe({
    standalone: true,
    name: "join",
})
export class JoinPipe implements PipeTransform {
    public transform(array: Array<string | number | null | undefined>, separateur: string = " "): string {
        return TextUtils.join(array, separateur);
    }
}
