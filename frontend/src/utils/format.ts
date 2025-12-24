/**
 * Format utility functions
 */

import { getLocale } from '../i18n';

const currencySymbol = '₼';
const formatterCache = new Map<string, Intl.NumberFormat>();

const getCurrencyFormatter = (locale: string) => {
  const cached = formatterCache.get(locale);
  if (cached) {
    return cached;
  }
  const formatter = new Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  formatterCache.set(locale, formatter);
  return formatter;
};

export interface CurrencyParts {
  sign: string;
  integer: string;
  fraction: string;
  decimal: string;
  symbol: string;
}

export function formatCurrencyParts(amountMinor: number): CurrencyParts {
  const amount = amountMinor / 100;
  const locale = getLocale();
  const parts = getCurrencyFormatter(locale).formatToParts(amount);
  let sign = '';
  let integer = '';
  let fraction = '';
  let decimal = ',';

  for (const part of parts) {
    switch (part.type) {
      case 'minusSign':
      case 'plusSign':
        sign = part.value;
        break;
      case 'integer':
      case 'group':
        integer += part.value;
        break;
      case 'fraction':
        fraction = part.value;
        break;
      case 'decimal':
        decimal = part.value;
        break;
      default:
        break;
    }
  }

  if (!fraction) {
    fraction = '00';
  }

  return {
    sign,
    integer,
    fraction,
    decimal,
    symbol: currencySymbol,
  };
}

export function formatCurrency(amountMinor: number): string {
  const parts = formatCurrencyParts(amountMinor);
  const symbol = parts.symbol ? ` ${parts.symbol}` : '';
  return `${parts.sign}${parts.integer}${parts.decimal}${parts.fraction}${symbol}`;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString(getLocale(), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: string): string {
  const normalized = date?.trim();
  if (!normalized) {
    return date;
  }

  const parsed = new Date(normalized.replace(' ', 'T'));
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }
  const locale = getLocale();
  const hasTime = /[T ]\d{2}:\d{2}/.test(normalized);
  const datePart = parsed.toLocaleDateString(locale, {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });
  if (!hasTime) {
    return datePart;
  }
  const timePart = parsed.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${datePart} ${timePart}`;
}

export function formatMonth(month: string): string {
  const [year, monthNum] = month.split('-');
  const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
  return date.toLocaleDateString(getLocale(), {
    year: 'numeric',
    month: 'long',
  });
}

export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getPreviousMonth(month: string): string {
  const [year, monthNum] = month.split('-');
  const date = new Date(parseInt(year), parseInt(monthNum) - 2, 1);
  const newYear = date.getFullYear();
  const newMonth = String(date.getMonth() + 1).padStart(2, '0');
  return `${newYear}-${newMonth}`;
}

export function getNextMonth(month: string): string {
  const [year, monthNum] = month.split('-');
  const date = new Date(parseInt(year), parseInt(monthNum), 1);
  const newYear = date.getFullYear();
  const newMonth = String(date.getMonth() + 1).padStart(2, '0');
  return `${newYear}-${newMonth}`;
}
