import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { EmptyComponent } from '../empty/empty.component';
import { StockService } from 'src/services/stock.service';
import {
  HistoricalDataPoint,
  HistoricalResultDto,
} from 'shared/models/historical-data.model';
import { catchError, EMPTY, Subject, takeUntil } from 'rxjs';
import moment from 'moment';
import { StockChartComponent } from '../stock-chart/stock-chart.component';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-history-page',
  imports: [CommonModule, EmptyComponent, StockChartComponent, LoaderComponent],
  templateUrl: './history-page.component.html',
  styleUrl: './history-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryPageComponent implements OnInit, OnDestroy {
  public chartOptions: object | null = null;
  public isLoading = true;
  public symbol: string | null = null;
  public name: string | null = null;
  public noData = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private location: Location,
    private readonly stockService: StockService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.symbol = navigation.extras.state['symbol'];
      this.name = navigation.extras.state['name'];
    }
  }

  ngOnInit(): void {
    if (this.symbol)
      this.stockService
        .getHistoricalData(this.symbol)
        .pipe(
          takeUntil(this.destroy$),
          catchError((error) => {
            this.stockService.displayErrorToast(
              `Hmm, I dont like the history about ${this.symbol} 🙈🙈🙈🙈🙈🙈`
            );
            console.error(error);
            return EMPTY;
          })
        )
        .subscribe((historicalResult: HistoricalResultDto) => {
          if (!historicalResult.historical) {
            this.isLoading = false;
            this.noData = true;
            this.stockService.displayErrorToast(
              "I don't like sharing data about this...🤫🤫🤫🔒🔒"
            );
            this.changeDetectorRef.detectChanges();
            return;
          }
          this.chartOptions = this._generateChartOptions(
            historicalResult.historical
          );
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public navigateBack(): void {
    this.location.back();
  }

  private _generateChartOptions(historicalData: HistoricalDataPoint[]): object {
    return {
      series: [
        {
          name: 'candle',
          data: this._transformToChartsData(historicalData),
        },
      ],
      chart: {
        height: 350,
        type: 'candlestick',
        toolbar: {
          show: false,
        },
        plotOptions: {
          candleStick: {
            colors: {
              upward: '#e1f8d4',
              downward: '#f8b3a0',
            },
          },
        },
      },

      tooltip: {
        enabled: true,
      },
      xaxis: {
        type: 'category',
        labels: {
          formatter: function (val: string | number | Date) {
            return moment(new Date(val)).format('MMM DD HH:mm');
          },
          style: {
            colors: '#edeade',
          },
        },
      },
      yaxis: {
        tooltip: {
          enabled: true,
        },
        labels: {
          style: {
            colors: '#edeade',
          },
        },
      },
    };
  }

  private _transformToChartsData(dataset: HistoricalDataPoint[]): object[] {
    const result: object[] = [];

    dataset.forEach((data) => {
      if (!this._isDateOlderThan30Days(new Date(data.date)))
        result.push({
          x: new Date(data.date),
          y: [data.open ?? 0, data.high ?? 0, data.low ?? 0, data.close ?? 0],
        });
    });
    if (!result.length) {
      this.noData = true;
    }
    return result.reverse();
  }

  private _isDateOlderThan30Days(date: Date): boolean {
    const today = new Date();
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;

    const timeDiffInMs = today.getTime() - date.getTime();
    if (timeDiffInMs >= thirtyDaysInMs) {
      return true;
    }
    return false;
  }
}
