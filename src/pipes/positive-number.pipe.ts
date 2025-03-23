import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'positiveNumber',
})
export class PositiveNumberPipe implements PipeTransform {
  transform(value: string | null): string {
    if (value === null) return 'null';
    return Number.parseFloat(value) > 0 ? `+${value}` : value.toString();
  }
}
