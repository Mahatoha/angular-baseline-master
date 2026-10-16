export class TextUtils {
    public static join(array: Array<string | number | undefined | null>, separateur: string = " "): string {
        return array.filter((item) => item != null && item !== "").join(separateur);
    }

    public static removeDiactitic(value: string): string;
    public static removeDiactitic(value: string | null): string | null;
    public static removeDiactitic(value: string | undefined): string | undefined;
    public static removeDiactitic(value: string | null | undefined): string | null | undefined;
    public static removeDiactitic(value: string | null | undefined): string | null | undefined {
        if (value == null) {
            return value;
        }
        return value.normalize("NFD").replace(/\p{Diacritic}/gu, "");
    }

    public static titleCase(value: string): string;
    public static titleCase(value: string | null | undefined): string | undefined;
    public static titleCase(value: string | null | undefined): string | undefined {
        if (value == null) return undefined;

        return value.replace(/\w\S*/g, (txt) => txt[0].toUpperCase() + txt.slice(1).toLowerCase());
    }
}
