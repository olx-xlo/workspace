export interface HistoricalDataPoint {
  date: string; // YYYY-MM-DD
  open: number | null | undefined;
  high: number | null | undefined;
  low: number | null | undefined;
  close: number | null | undefined;
  adjClose: number | null | undefined;
  volume: number | null | undefined;
  unadjustedVolume: number | null | undefined;
  change: number | null | undefined;
  changePercent: number | null | undefined;
  vwap: number | null | undefined;
  label: string | null | undefined;
  changeOverTime: number | null | undefined;
}

export interface HistoricalResultDto {
  symbol: string;
  historical: HistoricalDataPoint[];
}
