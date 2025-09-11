import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import CurrencyFlag from 'react-currency-flags';
import Skeleton from 'react-loading-skeleton';

import { useGetCurrenciesQuery } from '@store/apis/wise.api';
export default function CurrencyDropdown({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (code: string) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const { data: wiseMockCurrencies, isLoading, error } = useGetCurrenciesQuery();
  const [selectedCurrency, setSelectedCurrency] = useState<string>(value ?? 'GBP');

  if (isLoading) {
    return (
      <div className="relative min-w-[160px]">
        {label && <div className="text-sm mb-2 font-medium">{label}</div>}
        <button
          type="button"
          className="flex cursor-pointer border border-gray-300 dark:border-gray-700 flex-row justify-between items-center gap-2 px-4 py-1 rounded-full font-medium text-gray-700 w-full"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              <Skeleton circle={true} height={24} width={24} />
            </span>
            <Skeleton width={100} />
          </div>
          <FaChevronDown size={14} className="ml-1 text-gray-500" />
        </button>
      </div>
    );
  }

  if (error || !wiseMockCurrencies) {
    return (
      <div className="relative min-w-[160px]">
        {label && <div className="text-sm mb-2 font-medium">{label}</div>}
        <button
          type="button"
          className="flex cursor-pointer flex-row justify-between items-center gap-2 bg-[#ecefdc] px-4 py-1 rounded-full font-medium text-gray-700 w-full"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              <Skeleton circle={true} height={24} width={24} />
            </span>
            <Skeleton width={100} />
          </div>
          <FaChevronDown size={14} className="ml-1 text-gray-500" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-w-[160px]">
      {label && <div className="text-sm mb-2 font-medium">{label}</div>}
      <button
        type="button"
        className="flex cursor-pointer flex-row justify-between items-center gap-2 bg-[#ecefdc] px-4 py-1 rounded-full font-medium text-gray-700 w-full"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">
            <CurrencyFlag currency={selectedCurrency ?? 'GBP'} size="md" />
          </span>
          <span>{selectedCurrency ?? 'GBP'}</span>
        </div>
        <FaChevronDown size={14} className="ml-1 text-gray-500" />
      </button>
      {open && (
        <ul className="absolute left-0 top-full mt-2 z-10 overflow-x-hidden bg-white border rounded-lg shadow-lg w-full max-h-60 overflow-y-auto">
          {wiseMockCurrencies?.map((c) => (
            <li
              key={c.code}
              className={`flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-[#ecefdc] ${
                c.code === value ? 'bg-selected' : ''
              }`}
              onClick={() => {
                onChange(c.code);
                setSelectedCurrency(c.code);
                setOpen(false);
              }}
              role="option"
              aria-selected={c.code === value}
            >
              <span className="text-2xl">
                <CurrencyFlag currency={c.code} size="md" />
              </span>
              <span className="font-medium text-gray-500">{c.code}</span>
              <span className="text-gray-500 ml-2 text-xs">{c.symbol}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
