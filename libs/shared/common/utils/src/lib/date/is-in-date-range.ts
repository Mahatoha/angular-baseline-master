const END_HOURS: number = 23;
const END_MINUTES: number = 59;
const END_SECONDS: number = 59;
const END_MILLISECONDS: number = 999;

export function isInDateRange(date: Date, startDate: Date, endDate: Date, useDayBounds: boolean = false): boolean {
    const dateTime: number = new Date(date).getTime();
    const clonedStartDate: Date = new Date(startDate);
    const clonedEndDate: Date = new Date(endDate);

    if (useDayBounds) {
        clonedStartDate.setHours(0, 0, 0, 0);
        clonedEndDate.setHours(END_HOURS, END_MINUTES, END_SECONDS, END_MILLISECONDS);
    }

    return dateTime >= clonedStartDate.getTime() && dateTime <= clonedEndDate.getTime();
}
