import { format } from "date-fns";

import { DATE_BACKEND_FORMAT, DATETIME_BACKEND_FORMAT } from "./date-format";

export function toDateTimeString(date: Date): string;
export function toDateTimeString(date: Date | undefined | null): string | undefined;
export function toDateTimeString(date: Date | undefined | null): string | undefined {
    if (date === undefined || date === null) {
        return undefined;
    }
    return format(date, DATETIME_BACKEND_FORMAT);
}

export function toDateString(date: Date): string;
export function toDateString(date: Date | undefined | null): string | undefined;
export function toDateString(date: Date | undefined | null): string | undefined {
    if (date === undefined || date === null) {
        return undefined;
    }
    return format(date, DATE_BACKEND_FORMAT);
}
