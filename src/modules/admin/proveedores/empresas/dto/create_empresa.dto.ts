import { 
  IsString, 
  IsEmail, 
  IsDateString, 
  IsEnum, 
  MaxLength, 
  Length,
  IsNumberString
} from 'class-validator';
import { Transform } from 'class-transformer';
import { EstadoEmpresa } from '../enums/estado_empresa.enum';

export class CreateEmpresaDTO {

  @IsString()
  @Length(1, 250)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : null
  )
  nombreEmp: string;

  @IsString()
  @Length(1, 250)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : null
  )
  responsableEmp: string;

  @IsDateString()
  fechaContratoEmp: string; // llega como string ISO

  @IsString()
  @Length(1, 250)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : null
  )
  direccionEmp: string;

  @IsNumberString()
  @Length(7, 15)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : null
  )
  telefonoEmp: string;

  @IsEmail()
  @MaxLength(100)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : null
  )
  emailEmp: string;

  @IsEnum(EstadoEmpresa)
  estadoEmp: EstadoEmpresa;

  @IsString()
  @Length(1, 250)
  @Transform(({ value }) => {
    if (typeof value !== 'string' || value.trim() === '') {
      return 'ninguna';
    }
    return value.trim().toLowerCase();
  })
  descripcionEmp: string;

  toArray(): any[] {
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
