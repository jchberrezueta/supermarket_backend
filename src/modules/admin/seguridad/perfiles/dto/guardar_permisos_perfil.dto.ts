import { Type, Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsIn,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';

function toRequiredInt(value: unknown): number | unknown {
  if (value === null || value === undefined || value === '') {
    return value;
  }

  const numberValue = Number(value);

  return Number.isInteger(numberValue) ? numberValue : value;
}

export class PermisoPerfilItemDto {
  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(1)
  ideOpci!: number;

  @IsIn(['si', 'no'])
  listar!: 'si' | 'no';

  @IsIn(['si', 'no'])
  insertar!: 'si' | 'no';

  @IsIn(['si', 'no'])
  modificar!: 'si' | 'no';

  @IsIn(['si', 'no'])
  eliminar!: 'si' | 'no';
}

export class GuardarPermisosPerfilDto {
  @IsArray()
  @ArrayMaxSize(200)
  @ArrayUnique((permiso: PermisoPerfilItemDto) => permiso.ideOpci)
  @ValidateNested({
    each: true,
  })
  @Type(() => PermisoPerfilItemDto)
  permisos!: PermisoPerfilItemDto[];
}
