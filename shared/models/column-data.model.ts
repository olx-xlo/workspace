export interface ColumnData {
  symbol: string;
  name: string;
  price: number | null | undefined;
  changes: number | null | undefined;
  marketCap: number | null | undefined;
  changesPercentage: number | null | undefined;
}

export interface StockDto {
  symbol: string;
  name: string;
  price: number | null | undefined;
  changesPercentage: number | null | undefined;
  change: number | null | undefined;
  dayLow: number | null | undefined;
  dayHigh: number | null | undefined;
  yearHigh: number | null | undefined;
  yearLow: number | null | undefined;
  marketCap: number | null | undefined;
  priceAvg50: number | null | undefined;
  priceAvg200: number | null | undefined;
  exchange: string | null | undefined;
  volume: number | null | undefined;
  avgVolume: number | null | undefined;
  open: number | null | undefined;
  previousClose: number | null | undefined;
  eps: number | null | undefined;
  pe: number | null | undefined;
  earningsAnnouncement: Date | null | undefined;
  sharesOutstanding: number | null | undefined;
  timestamp: number | null | undefined;
}
