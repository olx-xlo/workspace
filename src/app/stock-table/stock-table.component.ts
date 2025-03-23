import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueryDto } from 'shared/models/query-data.model';
import { trigger, transition, style, animate } from '@angular/animations';
import { query, stagger } from '@angular/animations';
import { ColumnData } from 'shared/models/column-data.model';
import { StockService } from 'src/services/stock.service';
import { EmptyComponent } from '../empty/empty.component';
import { LoaderComponent } from '../loader/loader.component';
import {
  catchError,
  EMPTY,
  forkJoin,
  map,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { NumberSuffixPipe } from 'src/pipes/number-suffix.pipe';
import { PositiveNumberPipe } from 'src/pipes/positive-number.pipe';

@Component({
  selector: 'app-stock-table',
  imports: [
    CommonModule,
    EmptyComponent,
    LoaderComponent,
    NumberSuffixPipe,
    PositiveNumberPipe,
  ],
  templateUrl: './stock-table.component.html',
  styleUrl: './stock-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  animations: [
    trigger('appear', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-in', style({ opacity: 1 })),
      ]),
    ]),
    trigger('tableRows', [
      transition(':enter', [
        query(
          'tr',
          [
            style({ opacity: 0 }),
            stagger('50ms', [animate('300ms', style({ opacity: 1 }))]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class StockTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() queriedData: QueryDto[] | null = null;
  @Output() columnClicked: EventEmitter<ColumnData> = new EventEmitter();

  columnData: ColumnData[] = [];
  paginatedColumnData: ColumnData[] = [];
  pageSize = 10;
  currentPageIndex = 0;
  isLoadingPage = false;

  columnMap: Map<string, ColumnData> = new Map();

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly stockService: StockService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._resetAndLoad();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['queriedData']) {
      this._resetAndLoad();
    }
  }

  private _resetAndLoad(): void {
    this.columnMap.clear();
    this.columnData = [];
    this.currentPageIndex = 0;
    this._loadMoreData();
  }

  public handleColumnClick(column: ColumnData) {
    this.columnClicked.emit(column);
  }

  /**
   * This function checks the scroll position of the user to load more data if scrolled to bottom.
   */
  @HostListener('window:scroll', [])
  @HostListener('window:resize', [])
  onScroll(): void {
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight
    ) {
      this._loadMoreData();
    }
  }

  /**
   * This function is needed to check, if the content is too small and doesn't retrigger hew data loading
   */
  private checkContentHeight(): void {
    this.changeDetectorRef.detectChanges();
    if (document.documentElement.scrollHeight <= window.innerHeight) {
      this._loadMoreData();
    }
  }

  /**
   * This functions chunks up the queried data into bites of @var pageSize and loads their data seperately.
   * This is done so that on very big datasets not all of the columnlines are rendered at once and call too
   * many requests,
   */
  private _loadMoreData(): void {
    if (
      !this.queriedData ||
      this.isLoadingPage ||
      this.columnData.length >= this.queriedData.length
    )
      return;
    this.isLoadingPage = true;

    const newData = this.queriedData.slice(
      this.currentPageIndex * this.pageSize,
      (this.currentPageIndex + 1) * this.pageSize
    );

    newData.forEach((dataPoint) => {
      this.columnMap.set(dataPoint.symbol, {
        symbol: dataPoint.symbol,
        name: dataPoint.name,
        price: undefined,
        changes: undefined,
        marketCap: undefined,
        changesPercentage: undefined,
      });
    });

    this.changeDetectorRef.markForCheck();

    // Create observables for each new item to fetch stock data
    const stockDataObservables: Observable<ColumnData>[] = newData.map(
      (column) =>
        this.stockService.getStockData(column.symbol).pipe(
          map((stockData) =>
            this.stockService.transformStockDataToColumnData(
              stockData,
              column.symbol
            )
          ),
          catchError((error) => {
            this.stockService.displayErrorToast(
              `No data for ${column.symbol} today... 🚫📅📊🤷‍♂️`
            );
            console.error(error);
            return EMPTY;
          })
        )
    );

    forkJoin(stockDataObservables)
      .pipe(takeUntil(this.destroy$))
      .subscribe((results: ColumnData[]) => {
        results.forEach((column) => this.columnMap.set(column.symbol, column));
        this.columnData = [...this.columnMap.values()];
        this.isLoadingPage = false;
        this.currentPageIndex++;
        this.changeDetectorRef.markForCheck();
        this.checkContentHeight();
      });
  }
}
