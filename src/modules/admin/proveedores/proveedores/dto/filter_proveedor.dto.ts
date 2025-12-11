import { IsOptional, IsInt, IsString, Length, Min, IsNumberString, IsEmail } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { isIntNumeric } from '@helpers/utilities';
import { IFiltroProveedor } from '@models';

export class FilterProveedorDTO implements IFiltroProveedor {

  @IsOptional()
  @Transform(({value}) => isIntNumeric(value) ? (+value) : null )
  @IsInt()
  @Min(0)
  ideEmpr?: number;

  @IsOptional()
  @IsNumberString()
  @Length(7, 15)
  cedulaProv?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  primerNombreProv?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  apellidoPaternoProv?: string;

  @IsOptional()
  @IsEmail()
  @Length(1, 100)
  emailProv?: string;


  toArray(): any[] {
    return [
      this.ideEmpr ?? null,
      this.cedulaProv ?? null,
      this.primerNombreProv ?? null,
      this.apellidoPaternoProv ?? null,
      this.emailProv ?? null
    ];
  }
}
