export interface WiseCurrency {
  code: string;
  symbol: string;
  name: string;
  countryKeywords: string[];
  supportsDecimals: boolean;
}

export type ComparisonResponse = {
  sourceCurrency: string; // e.g., "GBP"
  targetCurrency: string; // e.g., "EUR"
  amount: number; // e.g., 10000
  amountType: 'SEND' | 'RECEIVE';
  providers: WiseProvider[];
};

export interface WiseQuote {
  rate: number;
  fee: number;
  dateCollected: string;
  sourceCountry: string | null;
  targetCountry: string | null;
  markup: number;
  receivedAmount: number;
  sendAmount: number | null;
  deliveryEstimation: {
    duration: {
      min: string;
      max: string;
    };
    providerGivesEstimate: boolean;
  };
  isConsideredMidMarketRate: boolean;
}

export interface WiseProvider {
  id: number;
  alias: string;
  name: string;
  logos: {
    normal: {
      svgUrl: string;
      pngUrl: string;
    };
    inverse: {
      svgUrl: string | null;
      pngUrl: string | null;
    };
    white: {
      svgUrl: string;
      pngUrl: string;
    };
    circle: {
      svgUrl: string;
      pngUrl: string | null;
    };
    altText: string;
  };
  type: string;
  partner: boolean;
  quotes: WiseQuote[];
}

export interface WiseComparison {
  sourceCurrency: string;
  targetCurrency: string;
  sourceCountry: string;
  targetCountry: string;
  providerCountry: string;
  providerTypes: string[];
  amount: number;
  amountType: string;
  providers: WiseProvider[];
}

export interface WiseRate {
  rate: number;
  source?: string;
  target?: string;
  time?: string;
}
