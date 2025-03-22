export interface QueryDto {
  symbol: string;
  name: string;
  currency: string | null | undefined;
  stockExchange: string | null | undefined;
  exchangeShortName: string | null | undefined;
}
