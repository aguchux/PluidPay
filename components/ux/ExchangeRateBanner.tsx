import React from 'react';
import { FaChevronRight } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';

import { useAppSelector } from '@hooks/redux';
import { useLazyGetRateQuery } from '@store/apis/wise.api';
import { WiseRate } from 'types/wise.types';

const ExchangeRateBanner = () => {
  const { fromCurrency, toCurrency } = useAppSelector((state) => state.app);
  const [getRate, { isLoading }] = useLazyGetRateQuery();
  const [rate, setRate] = React.useState<WiseRate>({
    rate: 1,
  });

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

  return (
    <div className="flex justify-end mb-6">
      <div className="flex flex-row justify-between text-sm items-center bg-gray-200 dark:bg-gray-50/30 dark:text-white text-gray-700 rounded-xl px-4 py-1 gap-2">
        <span className="text-sm">1 {fromCurrency}</span>
        <span> = </span>
        <span
          className={`font-semibold flex items-center gap-1 ${isLoading ? 'animate-pulse' : ''}`}
        >
          {isLoading ? <Skeleton width={20} /> : (rate.rate ?? '~')}
        </span>
        <span>{toCurrency}</span>
        <FaChevronRight size={16} className="text-gray-600 dark:text-white cursor-pointer" />
      </div>
    </div>
  );
};

export default ExchangeRateBanner;
