import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { StockDto } from '../../../shared/models/column-data.model';
import { HistoricalResultDto } from '../../../shared/models/historical-data.model';
import { QueryDto } from '../../../shared/models/query-data.model';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StockService {
  private readonly baseUrl = 'https://financialmodelingprep.com/api/v3';
  private readonly apiKey;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.apiKey = this.configService.get('API_KEY');
  }

  async getHistoricalData(
    symbol: string,
    startDate: string, //YYYY-MM-DD
    endDate: string //YYYY-MM-DD
  ): Promise<HistoricalResultDto> {
    const url = `${this.baseUrl}/historical-price-full/${symbol}?from=${startDate}&to=${endDate}&apikey=${this.apiKey}`;

    try {
      const result = await lastValueFrom(this.httpService.get(url));
      return result.data as HistoricalResultDto;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch historical data');
    }
  }

  async getStockBySymbol(symbol: string): Promise<StockDto> {
    const url = `${this.baseUrl}/quote/${symbol}?apikey=${this.apiKey}`;

    try {
      const result = await lastValueFrom(this.httpService.get(url));
      return result.data[0] as StockDto;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch stock by id');
    }
  }

  async queryStocks(query: string): Promise<QueryDto[]> {
    const url = `${this.baseUrl}/search?query=${query}&apikey=${this.apiKey}`;

    try {
      const result = await lastValueFrom(this.httpService.get(url));
      return result.data as QueryDto[];
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch query data');
    }
  }
}
