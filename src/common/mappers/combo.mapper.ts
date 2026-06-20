import { ComboOption } from '../interfaces/combo-option.interface';

export class ComboMapper {
  static fromEntities<TEntity, TValue = number | string>(
    entities: TEntity[],
    getLabel: (entity: TEntity) => string,
    getValue: (entity: TEntity) => TValue,
  ): ComboOption<TValue>[] {
    return entities.map((entity) => ({
      label: getLabel(entity),
      value: getValue(entity),
    }));
  }

  static fromValues<TValue extends string | number>(
    values: TValue[],
  ): ComboOption<TValue>[] {
    return values.map((value) => ({
      label: String(value),
      value,
    }));
  }
}
