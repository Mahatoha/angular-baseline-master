import { parse } from "date-fns";

import { DATE_BACKEND_FORMAT, DATETIME_BACKEND_FORMAT } from "./date-format";

export function fromDateTimeString(dateStr: string): Date;
export function fromDateTimeString(dateStr: string | undefined): Date | undefined;
export function fromDateTimeString(dateStr: string | undefined): Date | undefined {
    if (dateStr === undefined) {
        return undefined;
    }
    return parse(dateStr, DATETIME_BACKEND_FORMAT, new Date());
}

export function fromDateString(dateStr: string): Date;
export function fromDateString(dateStr: string | undefined): Date | undefined;
export function fromDateString(dateStr: string | undefined): Date | undefined {
    if (dateStr === undefined) {
        return undefined;
    }
    return parse(dateStr, DATE_BACKEND_FORMAT, new Date());
}
