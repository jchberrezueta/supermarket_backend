import { IsString, IsNumber, IsDateString, Length, Min, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateVentaCabeceraDto {

    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(1)
    ideClie: number;

    @IsString()
    @Length(1, 50)
    @Transform(({ value }) => (
        (typeof value === 'string' && value.trim() !== '') ? value.trim() : null
    ))
    numFacturaVent: string;

    @IsDateString()
    fechaVent: string;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(1)
    cantidadVent: number;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(0)
    subTotalVent: number;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(0)
    totalVent: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    dctoSocioVent: number = 0;  // Descuento por ser socio

    @IsNumber()
    @Min(0)
    @IsOptional()
    dctoEdadVent: number = 0;   // Descuento por tercera edad

    @IsString()
    @IsOptional()
    usuaIngre?: string;

    /**
     * Convierte a array para fn_insertar_venta
     * Orden: p_ide_empl, p_ide_clie, p_num_factura_vent, p_fecha_vent, 
     *        p_cantidad_vent, p_sub_total_vent, p_dcto_socio_vent, 
     *        p_dcto_edad_vent, p_total_vent, p_estado_vent, p_usua_ingre
     */
    toArray(): any[] {
        return [
            null,               // p_ide_empl - ventas desde móvil no tienen empleado
            this.ideClie,       // p_ide_clie
            this.numFacturaVent,// p_num_factura_vent
            this.fechaVent,     // p_fecha_vent
            this.cantidadVent,  // p_cantidad_vent
            this.subTotalVent,  // p_sub_total_vent
            this.dctoSocioVent, // p_dcto_socio_vent
            this.dctoEdadVent,  // p_dcto_edad_vent
            this.totalVent,     // p_total_vent
            'completado',       // p_estado_vent
            this.usuaIngre || 'mobile' // p_usua_ingre
        ];
    }
}
