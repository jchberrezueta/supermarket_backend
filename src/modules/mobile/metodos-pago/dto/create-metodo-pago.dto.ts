import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

function optionalInt(value: unknown): number | undefined | unknown {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  const numberValue = Number(value);

  if (Number.isInteger(numberValue)) {
    return numberValue;
  }

  return value;
}

function optionalString(value: unknown): string | undefined | unknown {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === 'string') {
    const text = value.trim();
    return text !== '' ? text : undefined;
  }

  return value;
}

function optionalLowerString(value: unknown): string | undefined | unknown {
  const text = optionalString(value);

  return typeof text === 'string' ? text.toLowerCase() : text;
}

export class CreateMetodoPagoDto {
  /**
   * Opcional porque el controller lo toma del JWT del cliente.
   */
  @IsOptional()
  @Transform(({ value }) => optionalInt(value))
  @IsInt()
  @Min(0)
  ideClie?: number;

  @IsString()
  @IsIn(['tarjeta_credito', 'tarjeta_debito', 'paypal'])
  tipoPago!: 'tarjeta_credito' | 'tarjeta_debito' | 'paypal';

  @IsString()
  @Length(1, 100)
  @Transform(({ value }) => optionalLowerString(value) ?? null)
  nombreTitular!: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  @Transform(({ value }) => optionalString(value))
  numeroTarjetaMasked?: string;

  @IsOptional()
  @IsString()
  @IsIn(['visa', 'mastercard', 'amex', 'diners'])
  @Transform(({ value }) => optionalLowerString(value))
  marcaTarjeta?: 'visa' | 'mastercard' | 'amex' | 'diners';

  @IsOptional()
  @IsString()
  @Length(1, 7)
  @Transform(({ value }) => optionalString(value))
  fechaExpiracion?: string;

  @IsOptional()
  @IsEmail()
  @Length(1, 100)
  @Transform(({ value }) => optionalLowerString(value))
  emailPaypal?: string;

  @IsOptional()
  @IsString()
  @IsIn(['si', 'no'])
  esPredeterminado?: 'si' | 'no';

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) => optionalLowerString(value))
  alias?: string;

  /**
   * Opcional porque el controller lo asigna desde el JWT.
   */
  @IsOptional()
  @IsString()
  @Length(1, 25)
  @Transform(({ value }) => optionalString(value))
  usuaIngre?: string;
}
