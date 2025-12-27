import { IsString, IsNumber, IsEnum, IsDateString, Length, IsInt, Min, IsOptional, Equals } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateVentaCabeceraDto {

    @IsInt()
    @Min(1)
    ideClie: number;

    @IsString()
    @Length(1, 25)
    @Transform(({ value }) => (
        (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
    ))
    numFacturaVent: string;

    @IsDateString()
    fechaVent: string;

    @IsInt()
    @Min(1)
    cantidadVent: number;

    @IsNumber()
    @Min(0)
    subTotalVent: number;

    @IsNumber()
    @Min(0)
    totalVent: number;

    @IsNumber()
    @Min(0)
    dctoVent: number;

    toArray(): any[] {
        // ideEmpl será 0 o un valor por defecto para ventas móviles (sin empleado)
        return [
            0, // ideEmpl - ventas desde móvil no tienen empleado asignado
            this.ideClie,
            this.numFacturaVent,
            this.fechaVent,
            this.cantidadVent,
            this.subTotalVent,
            this.dctoVent,
            this.totalVent,
            'completado' // estadoVent - las ventas móviles inician como completadas
        ];
    }
}
