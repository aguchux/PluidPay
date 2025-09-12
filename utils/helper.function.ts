/**
 * Helper functions for the application.
 */

import {
  ComparisonResponse,
  DeliveryDuration,
  LogoSet,
  ProviderRow,
  WiseQuote,
} from 'types/wise.types';

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

// Pick the best available logo URL from a LogoSet
export function pickLogoSrc(logo?: LogoSet): string | undefined {
  return (
    logo?.normal?.svgUrl ||
    logo?.normal?.pngUrl ||
    logo?.circle?.svgUrl ||
    logo?.circle?.pngUrl ||
    logo?.white?.svgUrl ||
    logo?.white?.pngUrl ||
    logo?.inverse?.svgUrl ||
    logo?.inverse?.pngUrl ||
    undefined
  );
}

export function isoDurationToHuman(d: DeliveryDuration): string | undefined {
  if (!d) return undefined;
  // If it's an object with min/max
  if (typeof d === 'object') {
    const min = d.min ? isoSingleToHuman(d.min) : undefined;
    const max = d.max ? isoSingleToHuman(d.max) : undefined;
    if (min && max && min !== max) return `${min} – ${max}`;
    return max || min;
  }
  // string like "PT72H"
  return isoSingleToHuman(d);
}

// convert ISO 8601 duration (https://en.wikipedia.org/wiki/ISO_8601#Durations)
// to human readable string
export function isoSingleToHuman(iso: string): string {
  // Very small, permissive parser: supports D, H, M, S
  // Examples: PT72H, PT2H30M, PT1S, P1DT2H
  const regex = /P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const m = iso.match(regex);
  if (!m) return iso;
  const [_, d = '0', h = '0', mnt = '0', s = '0'] = m;
  const day = Number(d);
  const hr = Number(h);
  const min = Number(mnt);
  const sec = Number(s);
  const parts: string[] = [];
  if (day) parts.push(`${day}d`);
  if (hr) parts.push(`${hr}h`);
  if (min) parts.push(`${min}m`);
  if (sec && !day && !hr && !min) parts.push(`${sec}s`);
  return parts.join(' ') || 'instantly';
}

// convert delivery estimation to human readable string
export function timeAgo(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffSec = Math.max(1, Math.floor((now - then) / 1000));
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

// Flatten comparison response to rows for display
export function flattenToRows(data: ComparisonResponse): ProviderRow[] {
  return (data.providers || [])
    .filter((p) => Array.isArray(p.quotes) && p.quotes.length)
    .map((p) => {
      const best = [...p.quotes].sort(
        (a, b) => (b.receivedAmount ?? 0) - (a.receivedAmount ?? 0),
      )[0];
      return {
        providerId: p.id,
        name: p.name,
        alias: p.alias,
        type: p.type,
        logoSrc: pickLogoSrc(p.logos),
        partner: p.partner,
        bestQuote: best,
        quotes: p.quotes,
        isMidMarket: !!best?.isConsideredMidMarketRate,
      } as ProviderRow;
    });
}

// Utility to join class names conditionally
export function classNames(...s: (string | false | undefined)[]) {
  return s.filter(Boolean).join(' ');
}
