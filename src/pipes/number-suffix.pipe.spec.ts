import { NumberSuffixPipe } from './number-suffix.pipe';

describe('NumberSuffixPipe', () => {
  let pipe: NumberSuffixPipe;
  beforeEach(() => {
    pipe = new NumberSuffixPipe();
  });
  it('should create an instance', () => {
    const pipe = new NumberSuffixPipe();
    expect(pipe).toBeTruthy();
  });

  it('should translate Thousand', () => {
    const value = 1000;
    const expectedResult = '1K';
    const result = pipe.transform(value, 0);
    expect(result).toBe(expectedResult);
  });

  it('should translate Million', () => {
    const value = 1000000;
    const expectedResult = '1M';
    const result = pipe.transform(value, 0);
    expect(result).toBe(expectedResult);
  });

  it('should translate Billion', () => {
    const value = 1000000000;
    const expectedResult = '1B';
    const result = pipe.transform(value, 0);
    expect(result).toBe(expectedResult);
  });

  it('should translate Trillion', () => {
    const value = 1000000000000;
    const expectedResult = '1T';
    const result = pipe.transform(value, 0);
    expect(result).toBe(expectedResult);
  });

  it('should use correct amount of digits', () => {
    const value = 1000;
    const expectedResult = '1.000K';
    const result = pipe.transform(value, 3);
    expect(result).toBe(expectedResult);
  });
});
