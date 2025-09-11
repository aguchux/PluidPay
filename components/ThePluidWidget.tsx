'use client';

import React from 'react';
import { FaChevronDown } from 'react-icons/fa';

import ActionButton from '@components/ux/ActionButton';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  setFromCurrency,
  setToCurrency,
  setFromAmount,
  setToAmount,
} from '@store/slices/app.slice';
import { useLazyGetRateQuery, useLazyGetComparisonsQuery } from '@store/apis/wise.api';
import { WiseProvider, WiseRate } from 'types/wise.types';
import { xChangeRateToAmount } from 'utils/helper.function';

import ActionLoader from './ActionLoader';
import CurrencyDropdown from './ux/CurrencyDropdown';
import ExchangeRateBanner from './ux/ExchangeRateBanner';
import CurrencyInput from './ux/CurrencyInput';
import { ProgressButton } from './ui';

const ThePluidWidget = () => {
  const dispatch = useAppDispatch();
  const { startSending, fromCurrency, toCurrency, fromAmount, toAmount } = useAppSelector(
    (state) => state.app,
  );
  const [getRate, { isLoading }] = useLazyGetRateQuery();
  const [rate, setRate] = React.useState<WiseRate>({
    rate: 1,
  });

  // Let's get all providers in the comparison
  const [providers, setProviders] = React.useState<WiseProvider[]>([]);

  // For getting comparisons of rates
  const [getComparisons, { data: comparisons, isLoading: isLoadingComparisons }] =
    useLazyGetComparisonsQuery();

  // Wanted to implement swapping currencies but ran out of time
  const [lastEdited, setLastEdited] = React.useState<'from' | 'to' | null>(null);

  const r = rate?.rate ?? 1;
  const approxEq = (a = 0, b = 0) => Math.abs(a - b) < 1e-9;
  const safeNum = (v: any) => (Number.isFinite(Number(v)) ? Number(v) : 0);

  React.useEffect(() => {
    if (!fromCurrency || !toCurrency) return;
    getRate({ sourceCurrency: fromCurrency, targetCurrency: toCurrency })
      .unwrap()
      .then((data) => {
        setRate(data);
      })
      .catch((error) => {
        console.error('Error fetching exchange rate:', error);
      });
  }, [fromCurrency, toCurrency]);

  /**
   * When rate changes, update the toAmount based on the fromAmount and the new rate.
   */
  React.useEffect(() => {
    if (!rate) return;
    const from = safeNum(fromAmount);
    if (!approxEq(fromAmount ?? 0, from)) {
      dispatch(setFromAmount(from));
    }
    dispatch(setToAmount(xChangeRateToAmount(from, rate.rate ?? 1, 'to')));
  }, [rate]);

  /**
   * When rate or fromCurrency, toCurrency, fromAmount changes, fetch comparisons
   * to get the best rates available.
   */
  React.useEffect(() => {
    // Let Also Get Comparisons
    if (!rate || !fromCurrency || !toCurrency || !fromAmount) return;
    getComparisons({
      sourceCurrency: fromCurrency,
      targetCurrency: toCurrency,
      sendAmount: fromAmount || 0,
    });
    setProviders(comparisons?.providers || []);
  }, [rate, fromCurrency, toCurrency, fromAmount]);

  return (
    <>
      <div className="flex flex-row h-screen w-screen justify-center items-center relative p-4">
        <ActionButton />
        {startSending && (
          <div className="bg-gray-100 dark:bg-background-light w-full md:w-1/3 h-full px-2 py-1 dark:bg-gray-800/50 rounded-xl border-2 border-gray-300 dark:border-gray-500">
            <div className=" p-8 rounded-lg max-w-md mx-auto">
              {/* Exchange Rate Banner */}
              <ExchangeRateBanner />
              {/* You Send */}
              <div className="flex items-center gap-4 mb-8">
                <div>
                  <CurrencyDropdown
                    value={fromCurrency!}
                    label="From Currency"
                    onChange={(code) => dispatch(setFromCurrency(code))}
                  />
                </div>
                <div className="flex-1 text-right">
                  <CurrencyInput
                    value={fromAmount ?? 0}
                    placeholder="0.00"
                    onChange={(value) => {
                      setLastEdited('from');
                      const from = safeNum(value);
                      if (!approxEq(fromAmount ?? 0, from)) {
                        dispatch(setFromAmount(from));
                      }
                      dispatch(
                        setToAmount(xChangeRateToAmount(Number(value), rate.rate ?? 1, 'to')),
                      );
                    }}
                  />
                </div>
              </div>
              {/*  alternate currency dropdown  */}
              {/* Exchange Icon */}
              <button type="button" className="flex justify-center -my-2 w-full cursor-pointer">
                <FaChevronDown size={24} className="text-gray-600 dark:text-white" />
              </button>
              {/*  alternate currency dropdown  */}
              {/* Recipient Gets */}
              <div className="flex flex-row justify-center items-center gap-4">
                <div>
                  <CurrencyDropdown
                    value={toCurrency!}
                    label="To Currency"
                    onChange={(code) => dispatch(setToCurrency(code))}
                  />
                </div>
                <div className="flex-1 text-right pt-4">
                  <CurrencyInput
                    value={toAmount ?? 0}
                    placeholder="0.00"
                    readOnly={true}
                    onChange={(value) => {
                      setLastEdited('to');
                      dispatch(setToAmount(Number(value)));
                    }}
                  />
                </div>
              </div>
            </div>
            {isLoadingComparisons || isLoading ? (
              <ActionLoader message="Getting the best rates for you..." />
            ) : comparisons?.providers.length ? (
              <div className="text-sm text-center text-gray-500 dark:text-gray-400">
                <div className="mt-4 p-4 flex flex-row text-sm mx-4 border bg-gray-300/60 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 rounded-lg">
                  <span>Available Providers: </span>
                  <div className="mx-2 text-green-400">|</div>
                  <div className="flex flex-wrap gap-1">
                    {providers.map((provider) => (
                      <button
                        className="text-gray-600 cursor-pointer dark:text-white text-sm bg-gray-200 dark:bg-gray-700 rounded-md px-2 py-1"
                        key={provider.id}
                      >
                        <span className="font-semibold hover:underline">{provider.name}</span> (
                        <em className="text-green-400">{provider.quotes[0]?.rate.toFixed(4)}</em>)
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-1 p-4 text-sm mx-4 border bg-gray-300/60 dark:bg-gray-800/50  border-gray-300 dark:border-gray-700 rounded-none">
                  qq
                </div>
              </div>
            ) : (
              <div className="mt-4 p-4 text-[10px] mx-4 text-center border bg-red-300/60 dark:bg-red-800/50 border-red-300 dark:border-red-700 rounded-lg">
                There are no available rates for the selected currency pair.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ThePluidWidget;
