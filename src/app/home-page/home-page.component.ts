import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { LogoComponent } from '../logo/logo.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { StockTableComponent } from '../stock-table/stock-table.component';
import { ColumnData } from 'shared/models/column-data.model';
import { QueryDto } from 'shared/models/query-data.model';
import { StockService } from 'src/services/stock.service';
import { catchError, EMPTY, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [
    CommonModule,
    StockTableComponent,
    SearchBarComponent,
    LogoComponent,
    AsyncPipe,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class HomePageComponent {
  isLoading = false;
  showTable = false;
  queriedData$: Observable<QueryDto[]> | null = null;

  constructor(
    private readonly stockService: StockService,
    private readonly router: Router
  ) {}

  searchStocks(query: string): void {
    if (query.length === 0) return;
    this.showTable = true;
    this.queriedData$ = this.stockService.queryStocks(query).pipe(
      catchError((error) => {
        this.stockService.displayErrorToast(
          'not feeling like giving you what you want....🤔🚫😔😉'
        );
        console.error(error);
        return EMPTY;
      })
    );
  }

  openHistoricalView(column: ColumnData): void {
    this.router.navigate(['history'], {
      state: {
        symbol: column.symbol,
        name: column.name,
      },
    });
  }
}
