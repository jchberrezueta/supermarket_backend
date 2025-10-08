import { 
  IsString, 
  IsEmail, 
  IsDate, 
  IsOptional, 
  IsEnum, 
  MaxLength, 
  Matches, 
  IsNotEmpty,
  IsNotEmptyObject,
  IsTimeZone
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Length } from 'class-validator';
import { Timestamp } from 'typeorm';

enum EstadoEmpresa {
    ACTIVO = 'activo',
    INACTIVO = 'inactivo'
}

export class CreateEmpresaDTO {
    @IsString()
    @Length(1, 250)
    @Transform(({value}) => (value == null || typeof value !== 'string')? null : value.trim().toLowerCase())
    nombre: string;

    @IsString()
    @Length(1, 250)
    @Transform(({value}) => (value == null || typeof value !== 'string')? null : value.trim().toLowerCase())
    responsable: string;

    @IsDate()
    @Type(() => Date)
    fechaContrato: Date;

    @IsString()
    @Length(1, 250)
    @Transform(({value}) => (value == null || typeof value !== 'string')? null : value.trim().toLowerCase())
    direccion: string;

    @IsString()
    @Matches(/^\+?[0-9\s\-\(\)]{10,15}$/, {
        message: 'El formato del teléfono no es válido'
    })
    @Length(1, 15)
    @Transform(({value}) => (value == null || typeof value !== 'string')? null : value.trim().toLowerCase())
    telefono: string;

    @IsEmail()
    @MaxLength(100)
    @Transform(({value}) => (value == null || typeof value !== 'string')? null : value.trim().toLowerCase())
    email: string;

    @IsString()
    @IsEnum(EstadoEmpresa)
    estado: string;

    @IsOptional()
    @IsString()
    @Length(1, 250)
    @Transform(({value}) => (value == null || typeof value !== 'string')? null : value.trim().toLowerCase())
    descripcion?: string = null;
}