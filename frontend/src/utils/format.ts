/**
 * Format utility functions
 */

const currencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const currencySymbol = '₼';

export interface CurrencyParts {
  sign: string;
  integer: string;
  fraction: string;
  decimal: string;
  symbol: string;
}

export function formatCurrencyParts(amountMinor: number): CurrencyParts {
  const amount = amountMinor / 100;
  const parts = currencyFormatter.formatToParts(amount);
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
  return new Date(date).toLocaleDateString('ru-RU', {
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

  const match = normalized.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::\d{2})?)?$/
  );

  if (match) {
    const [, year, month, day, hours, minutes] = match;
    const shortYear = year.slice(-2);
    if (!hours || !minutes) {
      return `${day}.${month}.${shortYear}`;
    }
    return `${day}.${month}.${shortYear} - ${hours}:${minutes}`;
  }

  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  const pad = (value: number) => String(value).padStart(2, '0');
  const day = pad(parsed.getDate());
  const month = pad(parsed.getMonth() + 1);
  const year = String(parsed.getFullYear()).slice(-2);
  const hours = pad(parsed.getHours());
  const minutes = pad(parsed.getMinutes());

  return `${day}.${month}.${year} - ${hours}:${minutes}`;
}

export function formatMonth(month: string): string {
  const [year, monthNum] = month.split('-');
  const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
  return date.toLocaleDateString('ru-RU', {
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

