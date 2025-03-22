import { Controller, Get, Param } from '@nestjs/common';
import { StockService } from './stock.service';
import { HistoricalResultDto } from '../../../shared/models/historical-data.model';
import { StockDto } from '../../../shared/models/column-data.model';
import { QueryDto } from '../../../shared/models/query-data.model';

@Controller()
export class StockController {
  constructor(private readonly stockService: StockService) {}
  @Get('historical-data/:symbol/:startDate/:endDate')
  async getHistoricalData(
    @Param('symbol') symbol: string,
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string
  ): Promise<HistoricalResultDto> {
    return await this.stockService.getHistoricalData(
      symbol,
      startDate,
      endDate
    );
  }

  @Get('quote/:symbol')
  async getStockBySymbol(@Param('symbol') symbol: string): Promise<StockDto> {
    return await this.stockService.getStockBySymbol(symbol);
  }

  @Get('query/:query')
  async query(@Param('query') query: string): Promise<QueryDto[]> {
    return await this.stockService.queryStocks(query);
  }
}
