import {
  format,
  parseISO,
  differenceInDays,
  differenceInCalendarDays,
} from "date-fns";

export { parseISO };
import { zhCN } from "date-fns/locale";

export function formatDate(
  dateStr: string | null | undefined,
  pattern: string = "yyyy年MM月dd日"
): string {
  if (!dateStr) return "—";
  try {
    const date = parseISO(dateStr);
    return format(date, pattern, { locale: zhCN });
  } catch {
    return dateStr;
  }
}

export function formatDateShort(
  dateStr: string | null | undefined
): string {
  if (!dateStr) return "—";
  try {
    const date = parseISO(dateStr);
    return format(date, "MM/dd", { locale: zhCN });
  } catch {
    return dateStr;
  }
}

export function formatMoney(value: number | null | undefined): string {
  if (value === null || value === undefined) return "¥0.00";
  return `¥${value.toFixed(2)}`;
}

export function daysBetween(
  dateStr1: string | null,
  dateStr2: string | null
): number | null {
  if (!dateStr1 || !dateStr2) return null;
  try {
    const d1 = parseISO(dateStr1);
    const d2 = parseISO(dateStr2);
    return Math.abs(differenceInDays(d2, d1));
  } catch {
    return null;
  }
}

export function daysSince(dateStr: string | null): number | null {
  if (!dateStr) return null;
  try {
    const date = parseISO(dateStr);
    return differenceInCalendarDays(new Date(), date);
  } catch {
    return null;
  }
}

export function getYearMonth(dateStr: string | null): string {
  if (!dateStr) return "";
  try {
    const date = parseISO(dateStr);
    return format(date, "yyyy-MM");
  } catch {
    return "";
  }
}

export function getMonth(dateStr: string | null): number {
  if (!dateStr) return 0;
  try {
    const date = parseISO(dateStr);
    return date.getMonth() + 1;
  } catch {
    return 0;
  }
}

export function getYear(dateStr: string | null): number {
  if (!dateStr) return 0;
  try {
    const date = parseISO(dateStr);
    return date.getFullYear();
  } catch {
    return 0;
  }
}

export function getMonthName(month: number): string {
  const names = [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月",
  ];
  return names[month - 1] || "";
}

export function getWaitingBadgeColor(days: number): string {
  if (days >= 30) return "bg-envelope-500 text-white";
  if (days >= 14) return "bg-envelope-400 text-white";
  if (days >= 7) return "bg-stamp-400 text-white";
  return "bg-ink-400 text-white";
}
