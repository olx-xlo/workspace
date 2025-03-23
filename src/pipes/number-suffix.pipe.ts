import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberSuffix',
})
export class NumberSuffixPipe implements PipeTransform {
  transform(value: number | null | undefined, digits = 1): string {
    if (value === null) return '';
    if (value === undefined) return '';
    if (isNaN(value)) return '';
    if (value === 0) return '0';

    const absValue = Math.abs(value);
    const sign = Math.sign(value);
    let suffix = '';
    let shortValue: number;

    if (absValue >= 1e12) {
      suffix = 'T';
      shortValue = absValue / 1e12;
    } else if (absValue >= 1e9) {
      suffix = 'B';
      shortValue = absValue / 1e9;
    } else if (absValue >= 1e6) {
      suffix = 'M';
      shortValue = absValue / 1e6;
    } else if (absValue >= 1e3) {
      suffix = 'K';
      shortValue = absValue / 1e3;
    } else {
      return value.toString();
    }

    return (sign * shortValue).toFixed(digits) + suffix;
  }
}
