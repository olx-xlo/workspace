import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  imports: [CommonModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SearchBarComponent {
  @Input() placeholder!: string;
  @Output() searchEmitter: EventEmitter<string> = new EventEmitter();

  onEnter(value: string) {
    this.searchEmitter.emit(value);
  }
}
