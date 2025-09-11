/**
 * Helper functions for the application.
 */

import { WiseQuote } from 'types/wise.types';

// Convert amount based on exchange rate and direction
export const xChangeRateToAmount = (
  amount: number,
  rate: number,
  direction: 'from' | 'to',
): number => {
  return direction === 'to' ? amount * rate : amount / rate;
};

//  Compute both fromAmount and toAmount based on the given rate
export const computeExchangeAmount = (
  fromAmount: number,
  toAmount: number,
  rate: number,
): {
  fromAmount: number;
  toAmount: number;
} => {
  return {
    fromAmount: fromAmount * rate,
    toAmount: toAmount / rate,
  };
};

// Format as Generic currency with 2 decimal places
export function toMoney(n: number | null | undefined, currencyCode: string = 'GBP') {
  if (n == null) return '—';
  return n.toLocaleString('en-GB', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 2,
  });
}

// Format as GBP currency
export function gbp(n: number | null | undefined) {
  if (n == null) return '—';
  return n.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 2,
  });
}

// Format as Euro currency with 2 decimal places
export function eur(n: number | null | undefined) {
  if (n == null) return '—';
  return n.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  });
}

// Format as exchange rate with up to 6 decimal places
export function rateFmt(n: number | null | undefined) {
  if (n == null) return '—';
  return n.toLocaleString('en-GB', { maximumFractionDigits: 6 });
}

// Format as percentage with 2 decimal places
export function pctFmt(n: number | null | undefined) {
  if (n == null) return '—';
  return `${n.toFixed(2)}%`;
}

// Pick the quote with highest received amount for a provider
export function pickBestQuote(quotes: WiseQuote[]): WiseQuote | null {
  const valid = quotes.filter((q) => typeof q.receivedAmount === 'number');
  if (valid.length === 0) return null;
  return valid.reduce((best, q) =>
    (q.receivedAmount ?? -Infinity) > (best.receivedAmount ?? -Infinity) ? q : best,
  );
}
