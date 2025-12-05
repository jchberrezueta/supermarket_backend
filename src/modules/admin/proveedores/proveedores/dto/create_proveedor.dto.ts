import { Transform } from 'class-transformer';
import { 
  IsInt, IsString, IsOptional, IsDateString, IsEmail, 
  Length, Min, 
  IsNumberString
} from 'class-validator';

export class CreateProveedorDTO {

  @IsInt()
  ideEmpr: number;

  @IsNumberString()
  @Length(7, 15)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : null
  )
  cedulaProv: string;

  @IsDateString()
  fechaNacimientoProv: string;

  @IsInt()
  @Min(1)
  edadProv: number;

  @IsNumberString()
  @Length(7, 15)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : null
  )
  telefonoProv: string;

  @IsEmail()
  @Length(1, 100)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : null
  )
  emailProv: string;

  @IsString()
  @Length(1, 50)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : null
  )
  primerNombreProv: string;

  @IsString()
  @Length(1, 50)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : null
  )
  apellidoPaternoProv: string;

  @IsOptional()
  @IsString()
  @Length(0, 50)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : null
  )
  segundoNombreProv?: string;

  @IsOptional()
  @IsString()
  @Length(0, 50)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : null
  )
  apellidoMaternoProv?: string;


  toArray(): any[] {
    return [
      this.ideEmpr,
      this.cedulaProv,
      this.fechaNacimientoProv,
      this.edadProv,
      this.telefonoProv,
      this.emailProv,
      this.primerNombreProv,
      this.apellidoPaternoProv,
      this.segundoNombreProv ?? null,
      this.apellidoMaternoProv ?? null,
    ];
  }
}
