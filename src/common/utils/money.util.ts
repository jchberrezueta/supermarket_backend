export class MoneyUtil {
  static toNumber(
    value: string | number | null | undefined,
    defaultValue = 0,
  ): number {
    if (value === null || value === undefined || value === '') {
      return defaultValue;
    }

    const numberValue = Number(value);

    if (Number.isNaN(numberValue)) {
      return defaultValue;
    }

    return numberValue;
  }

  static round(
    value: string | number | null | undefined,
    decimals = 2,
  ): number {
    const numberValue = this.toNumber(value);
    const factor = Math.pow(10, decimals);

    return Math.round((numberValue + Number.EPSILON) * factor) / factor;
  }

  static toMoneyString(value: string | number | null | undefined): string {
    return this.round(value).toFixed(2);
  }

  static normalizeRate(value: string | number | null | undefined): number {
    const rate = this.toNumber(value);

    if (rate > 1) {
      return rate / 100;
    }

    return rate;
  }

  static multiply(
    valueA: string | number | null | undefined,
    valueB: string | number | null | undefined,
  ): number {
    return this.round(this.toNumber(valueA) * this.toNumber(valueB));
  }

  static add(...values: Array<string | number | null | undefined>): number {
    const total = values.reduce<number>((acc, value) => {
      return acc + this.toNumber(value);
    }, 0);

    return this.round(total);
  }

  static subtract(
    valueA: string | number | null | undefined,
    valueB: string | number | null | undefined,
  ): number {
    return this.round(this.toNumber(valueA) - this.toNumber(valueB));
  }
}
