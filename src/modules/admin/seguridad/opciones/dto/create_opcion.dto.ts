import { EnumEstadosOpcion, IOpciones } from '@models';
import { Transform } from 'class-transformer';
import { IsString, Equals, IsInt, Min, IsEnum, Length, IsOptional } from 'class-validator';

export class CreateOpcionDto implements IOpciones {

    @IsInt()
    @Equals(-1)
    ideOpci: number;

    @IsString()
    @Length(1, 100)
    @Transform(({ value }) =>
        (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
    )
    nombreOpci: string;

    @IsString()
    @Length(1, 500)
    @Transform(({ value }) =>
        (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
    )
    rutaOpci: string;

    @IsEnum(EnumEstadosOpcion)
    activoOpci: EnumEstadosOpcion;

    @IsString()
    @Length(1, 250)
    @Transform(({ value }) =>
        (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : 'ninguna'
    )
    descripcionOpci: string;

    @IsInt()
    @Min(0)
    nivelOpci: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    padreOpci?: number;

    @IsOptional()
    @IsString()
    @Length(1, 50)
    @Transform(({ value }) =>
        (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
    )
    iconoOpci?: string;

  toArray(): any[] {
    return [
        this.nombreOpci,
        this.rutaOpci,
        this.nivelOpci,
        this.padreOpci?? null,
        this.iconoOpci?? null,
        this.activoOpci,
        this.descripcionOpci
    ]
  }
}