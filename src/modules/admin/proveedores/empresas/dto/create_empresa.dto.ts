import { 
  IsString, 
  IsEmail, 
  IsDateString, 
  IsEnum, 
  MaxLength, 
  Length,
  IsNumberString,
  IsInt,
  Equals
} from 'class-validator';
import { Transform } from 'class-transformer';
import { EnumEstadosEmpresa, IEmpresa } from '@models';

export class CreateEmpresaDTO implements IEmpresa{

  @IsInt()
  @Equals(-1)
  ideEmp: number;

  @IsString()
  @Length(1, 250)
  @Transform(({ value }) =>
    (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
  )
  nombreEmp: string;

  @IsString()
  @Length(1, 250)
  @Transform(({ value }) =>
    (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
  )
  responsableEmp: string;

  @IsDateString()
  fechaContratoEmp: string; // llega como string ISO

  @IsString()
  @Length(1, 250)
  @Transform(({ value }) =>
    (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
  )
  direccionEmp: string;

  @IsNumberString()
  @Length(7, 15)
  @Transform(({ value }) =>
    (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
  )
  telefonoEmp: string;

  @IsEmail()
  @MaxLength(100)
  @Transform(({ value }) =>
    (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
  )
  emailEmp: string;

  @IsEnum(EnumEstadosEmpresa)
  estadoEmp: EnumEstadosEmpresa;

  @IsString()
  @Length(1, 250)
  @Transform(({ value }) => 
    (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : 'ninguna'
  )
  descripcionEmp: string;

  toArray (): any[] {
    return [
      this.nombreEmp,
      this.responsableEmp,
      this.fechaContratoEmp,
      this.direccionEmp,
      this.telefonoEmp,
      this.emailEmp,
      this.estadoEmp,
      this.descripcionEmp
    ];
  }
}
