import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ColumnData, StockDto } from 'shared/models/column-data.model';
import { QueryDto } from 'shared/models/query-data.model';
import { HistoricalResultDto } from 'shared/models/historical-data.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  //nestjs url
  private readonly backendUrl = 'api';

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService
  ) {}

  getHistoricalData(
    symbol: string,
    startDate: Date = new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      new Date().getDay()
    ),
    endDate: Date = new Date()
  ): Observable<HistoricalResultDto> {
    return this.http.get<HistoricalResultDto>(
      `${this.backendUrl}/historical-data/${symbol}/${this._formatDate(
        startDate
      )}/${this._formatDate(endDate)}`
    );
  }

  getStockData(symbol: string): Observable<StockDto> {
    return this.http.get<StockDto>(`${this.backendUrl}/quote/${symbol}`);
  }

  queryStocks(query: string): Observable<QueryDto[]> {
    return this.http.get<QueryDto[]>(`${this.backendUrl}/query/${query}`);
  }

  displayErrorToast(message: string): void {
    this.toastr.error(message);
  }

  transformStockDataToColumnData(
    stockData: StockDto,
    symbol: string
  ): ColumnData {
    if (stockData === null) {
      return {
        symbol,
        name: '🤔',
        price: null,
        changes: null,
        marketCap: null,
        changesPercentage: null,
      };
    }
    return {
      symbol: stockData.symbol,
      name: stockData.name,
      price: stockData.price,
      changes: stockData.change,
      marketCap: stockData.marketCap,
      changesPercentage: stockData.changesPercentage,
    };
  }

  private _formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
