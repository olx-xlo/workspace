import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'app-stock-chart',
  imports: [CommonModule, ChartComponent],
  templateUrl: './stock-chart.component.html',
  styleUrl: './stock-chart.component.scss',
  standalone: true,
})
export class StockChartComponent {
  @Input() chartOptions: any;
}
