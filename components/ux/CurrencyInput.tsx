import { useEffect, useState } from 'react';

type Props = {
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  precision?: number; // default 2
  readOnly?: boolean;
};

export default function CurrencyInput({
  value,
  onChange,
  placeholder = '0.00',
  precision = 2,
  readOnly = false,
}: Props) {
  const [display, setDisplay] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);

  const roundTo = (n: number, p: number) => Math.round((n + Number.EPSILON) * 10 ** p) / 10 ** p;

  const formatNumber = (n: number) =>
    n.toLocaleString('en-GB', {
      style: 'decimal',
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    });

  // Turn a number into an editable string with <= precision decimals (no commas)
  const toEditable = (n: number | null) => {
    if (n === null) return '';
    const r = roundTo(n, precision).toFixed(precision);
    // Trim trailing zeros and possible trailing dot, so "12.00" -> "12", "12.50" -> "12.5"
    return r.replace(new RegExp(`\\.0{1,${precision}}$`), '').replace(/\.$/, '');
  };

  // Remove non-digits except dot, keep a single dot, clamp decimals to precision
  const sanitize = (str: string) => {
    let s = str.replace(/[^\d.]/g, '');
    const firstDot = s.indexOf('.');
    if (firstDot !== -1) {
      // keep only first dot
      s = s.slice(0, firstDot + 1) + s.slice(firstDot + 1).replace(/\./g, '');
      // clamp to precision decimals
      const [i, d = ''] = s.split('.');
      s = `${i}.${d.slice(0, precision)}`;
    }
    // normalize leading dot -> "0."
    if (s.startsWith('.')) s = '0' + s;
    // drop leading zeros like "0005" -> "5" but keep "0." pattern
    if (!s.startsWith('0.')) s = s.replace(/^0+(?=\d)/, '');
    return s;
  };

  const parseNum = (s: string) => {
    if (!s) return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = sanitize(e.target.value);
    setDisplay(raw);
    onChange(parseNum(raw));
  }

  function handleFocus() {
    setIsFocused(true);
    // show editable (unformatted, <= 2dp)
    setDisplay(toEditable(value));
  }

  function handleBlur() {
    setIsFocused(false);
    if (value !== null) {
      setDisplay(formatNumber(roundTo(value, precision)));
    } else {
      setDisplay('');
    }
  }

  // keep in sync when parent value changes while not editing
  useEffect(() => {
    if (!isFocused) {
      setDisplay(value !== null ? formatNumber(roundTo(value, precision)) : '');
    }
  }, [value, isFocused, precision]);

  return (
    <input
      className="bg-transparent text-gray-400 text-2xl border px-2 border-gray-700/40 py-2 w-full text-right font-bold rounded-md focus:outline-none focus:ring-1 focus:ring-transparent"
      type="text"
      inputMode="decimal"
      maxLength={18}
      value={display}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      readOnly={readOnly}
    />
  );
}
