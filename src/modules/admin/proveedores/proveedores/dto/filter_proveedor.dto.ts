import { IsOptional, IsInt, IsString, Length, Min, IsNumberString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class FilterProveedorDTO {

  @IsOptional()
  @IsInt()
  @Min(0)
  ideEmpr?: number;

  @IsNumberString()
  @Length(7, 15)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : null
  )
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
