import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

function toRequiredInt(value: unknown): number | unknown {
  if (value === null || value === undefined || value === '') {
    return value;
  }

  const numberValue = Number(value);

  if (Number.isInteger(numberValue)) {
    return numberValue;
  }

  return value;
}

export class RegisterClienteDto {
  @IsNumberString()
  @Length(7, 15)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  cedulaClie!: string;

  @IsDateString()
  fechaNacimientoClie!: string;

  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(1)
  edadClie!: number;

  @IsNumberString()
  @Length(7, 15)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  telefonoClie!: string;

  @IsString()
  @Length(1, 50)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : null,
  )
  primerNombreClie!: string;

  @IsString()
  @Length(1, 50)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : null,
  )
  apellidoPaternoClie!: string;

  @IsEmail()
  @Length(1, 100)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : null,
  )
  emailClie!: string;

  @IsString()
  @Length(6, 255)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  password!: string;

  /**
   * Se mantiene default por compatibilidad con clientes móviles anteriores.
   * La BD no tiene default; el service también asegura 'no' si no llega.
   */
  @IsOptional()
  @IsString()
  @IsIn(['si', 'no'])
  esSocio?: 'si' | 'no' = 'no';

  /**
   * Se mantiene default por compatibilidad con clientes móviles anteriores.
   */
  @IsOptional()
  @IsString()
  @IsIn(['si', 'no'])
  esTerceraEdad?: 'si' | 'no' = 'no';

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : null,
  )
  segundoNombreClie?: string | null;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : null,
  )
  apellidoMaternoClie?: string | null;

  /**
   * Retorna array para compatibilidad con flujo legacy.
   */
  toArrayCliente(): any[] {
    return [
      this.cedulaClie,
      this.fechaNacimientoClie,
      this.edadClie,
      this.telefonoClie,
      this.primerNombreClie,
      this.apellidoPaternoClie,
      this.emailClie,
      this.esSocio ?? 'no',
      this.esTerceraEdad ?? 'no',
      this.segundoNombreClie ?? null,
      this.apellidoMaternoClie ?? null,
    ];
  }
}
