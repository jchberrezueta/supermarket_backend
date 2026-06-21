export class IdUtil {
  static parseId(
    value: unknown,
    options: { allowZero?: boolean } = { allowZero: true },
  ): number | null {
    const allowZero = options.allowZero ?? true;

    if (value === null || value === undefined) {
      return null;
    }

    const textValue = String(value).trim();

    if (textValue === '') {
      return null;
    }

    const numericValue = Number(textValue);

    if (!Number.isInteger(numericValue)) {
      return null;
    }

    if (numericValue < 0) {
      return null;
    }

    if (!allowZero && numericValue === 0) {
      return null;
    }

    return numericValue;
  }

  static isValidId(
    value: unknown,
    options: { allowZero?: boolean } = { allowZero: true },
  ): boolean {
    return this.parseId(value, options) !== null;
  }
}
