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
  logos: LogoSet;
  type: string;
  partner: boolean;
  quotes: WiseQuote[];
}

export type LogoSet = {
  normal?: { svgUrl?: string | null; pngUrl?: string | null };
  inverse?: { svgUrl?: string | null; pngUrl?: string | null };
  white?: { svgUrl?: string | null; pngUrl?: string | null };
  circle?: { svgUrl?: string | null; pngUrl?: string | null };
  altText?: string;
};

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

export type DeliveryDuration =
  | null
  | string // sometimes just "PT1S"
  | {
      min: string | null;
      max: string | null;
    };

export type DeliveryEstimation = {
  providerGivesEstimate: boolean;
  duration: DeliveryDuration;
};

export interface WiseRate {
  rate: number;
  source?: string;
  target?: string;
  time?: string;
}

export type ProviderRow = {
  providerId: number;
  name: string;
  alias: string;
  type: 'bank' | 'moneyTransferProvider' | string;
  logoSrc?: string;
  logos: LogoSet;
  partner: boolean;
  bestQuote: WiseQuote;
  quotes: WiseQuote[]; // all quotes for that provider
  isMidMarket: boolean; // best quote mid-market flag
};
