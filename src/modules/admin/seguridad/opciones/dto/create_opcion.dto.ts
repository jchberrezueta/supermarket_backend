import { EnumEstadosCuenta, EnumEstadosOpcion, ICuenta, IOpciones } from '@models';
import { Transform } from 'class-transformer';
import { IsString, Equals, IsInt, Min, IsEnum, Length } from 'class-validator';

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

    @IsInt()
    @Min(0)
    padreOpci: number;

    @IsString()
    @Length(1, 50)
    @Transform(({ value }) =>
        (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
    )
    iconoOpci: string;

  toArray(): any[] {
    return [
        this.nombreOpci,
        this.rutaOpci,
        this.activoOpci,
        this.descripcionOpci,
        this.nivelOpci,
        this.padreOpci,
        this.iconoOpci
    ]
  }
}