import { IsOptional, IsInt, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterProveedorDTO {

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  ideEmpr?: number;

  @IsOptional()
  @IsString()
  @Length(1, 15)
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
  @IsString()
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
