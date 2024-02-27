import { format, parse } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";

/**
 * These functions can be used to parse date or datetime strings.
 */
export const stringToDatetime = (str: string) => new Date(Date.parse(str));
export const stringToDatetimeOrNull = (str: string | null) => str ? new Date(Date.parse(str)) : null;
export const dateStringToDatetime = (str: string) => zonedTimeToUtc(parse(str, "dd/MM/yyyy", new Date()), "UTC");
export const dateToDateString = (date: Date) => format(date, "dd/MM/yyyy");
export const dateToDateStringOrNull = (date: Date | null) => date ? format(date, "dd/MM/yyyy") : null;
export const dateToDatetimeString = (date: Date) => format(date, "dd/MM/yyyy HH:mm:ss");