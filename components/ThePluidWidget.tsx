'use client';

import React from 'react';
import { FaChevronDown } from 'react-icons/fa';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import { SendHorizontalIcon } from 'lucide-react';

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
import PriceComparisonChart from './ux/PriceComparisonChart';

const ThePluidWidget = () => {
  const dispatch = useAppDispatch();

  // App State (from Redux)
  const { startSending, fromCurrency, toCurrency, fromAmount, toAmount } = useAppSelector(
    (state) => state.app,
  );

  // Setup for fetching exchange rates
  // Lazy query to fetch rate on demand
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
  const [_, setLastEdited] = React.useState<'from' | 'to' | null>(null);

  // Helper to compare floating point numbers
  const approxEq = (a = 0, b = 0) => Math.abs(a - b) < 1e-9;
  const safeNum = (v: any) => (Number.isFinite(Number(v)) ? Number(v) : 0);

  // Fetch exchange rate when fromCurrency or toCurrency changes
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
  }, [fromCurrency, toCurrency, getRate]);

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
  }, [rate, fromAmount, dispatch]);

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
  }, [rate, comparisons?.providers, fromCurrency, toCurrency, fromAmount]);

  const [currentTab, setCurrentTab] = React.useState(0);
  // Build Tab data
  const compareTabs = [
    {
      label: 'Basic Comparison',
      content: (
        <div>
          <h3 className="text-lg font-semibold">Overview</h3>
          <p className="mt-2 text-sm text-gray-600">Quick summary content goes here.</p>
        </div>
      ),
    },
    {
      label: 'Charts & Graphs',
      content: (
        <PriceComparisonChart
          data={{
            sourceCurrency: fromCurrency!,
            targetCurrency: toCurrency!,
            amount: fromAmount!,
            amountType: 'SEND',
            providers: comparisons?.providers || [],
          }}
        />
      ),
    },
  ] satisfies TabItem[];

  return (
    <>
      <div className="flex flex-row h-screen w-screen justify-center items-center relative p-4">
        <ActionButton />
        {startSending ? (
          <>
            <div className="bg-gray-100 text-black dark:text-white w-full md:w-1/3 h-full px-2 py-1 dark:bg-gray-800/50 rounded-xl border-2 border-gray-300 dark:border-gray-500">
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
                    {isLoadingComparisons ? (
                      <Skeleton width={100} height={24} />
                    ) : (
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
                    )}
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
                    {isLoadingComparisons ? (
                      <Skeleton width={100} height={24} />
                    ) : (
                      <CurrencyInput
                        value={toAmount ?? 0}
                        placeholder="0.00"
                        readOnly={true}
                        onChange={(value) => {
                          setLastEdited('to');
                          dispatch(setToAmount(Number(value)));
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
              {isLoadingComparisons || isLoading ? (
                <ActionLoader message="Getting the best rates for you..." />
              ) : comparisons?.providers.length ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <div className="mt-4 p-4 flex flex-col text-sm mx-4 border bg-gray-300/60 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 rounded-lg">
                    <div className="font-semibold mb-2">Available Providers: </div>
                    <div className="flex flex-wrap gap-1 flex-row ">
                      {providers.map((provider) => (
                        <button
                          className="text-gray-900 cursor-pointer dark:text-white text-sm bg-gray-300 dark:bg-gray-700 rounded-md px-2 py-1"
                          key={provider.id}
                        >
                          <span className="font-semibold hover:underline">{provider.name}</span> (
                          <em className="text-green-900 dark:text-green-400">
                            {provider.quotes[0]?.rate.toFixed(4)}
                          </em>
                          )
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-4 text-base mx-4 text-center border bg-red-300/60 dark:bg-red-800/50 border-red-300 dark:border-red-700 rounded-lg">
                  There are no available rates for the selected currency pair.
                </div>
              )}
            </div>

            <div
              className={`mt-0 p-4 h-full ${comparisons?.providers.length ? '' : 'hidden'} w-full md:w-1/3`}
            >
              {/* Simple Tab Switch */}
              <div className="border-b border-gray-300 dark:border-gray-600 mb-4">
                <div className="flex space-x-4">
                  {compareTabs.map((tab, index) => (
                    <button
                      key={index}
                      className={`px-3 py-2 font-medium text-sm rounded-t-lg ${
                        index === currentTab
                          ? 'bg-white dark:bg-gray-800 border-b-2 border-primary text-primary'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      }`}
                      onClick={() => {
                        setCurrentTab(index);
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                {compareTabs.map((tab, index) => (
                  <div
                    key={index}
                    data-tab-content={true}
                    className={`${
                      index === currentTab ? '' : 'hidden'
                    } bg-gray-100 dark:bg-gray-800 p-4 rounded-lg`}
                  >
                    {tab.content}
                  </div>
                ))}
              </div>

              {/* Simple Tab Switch */}
            </div>
          </>
        ) : (
          <div className="text-center flex flex-col items-center">
            {/* Download my CV */}
            <Link
              href="/cv/CV_JULY_2025.docx"
              className="mt-4 text-5xl inline-block text-gray-600 dark:text-white hover:underline"
              download={true}
            >
              Download My CV
            </Link>
            <div className="mt-2 text-center flex gap-2 text-gray-500 dark:text-gray-400">
              <span>(Click the</span>
              <span className="text-red-600 font-bold">TOP-LEFT</span>
              <SendHorizontalIcon className="h-5 w-5 text-primary m-auto" />
              <span>button above to view widget)</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ThePluidWidget;
