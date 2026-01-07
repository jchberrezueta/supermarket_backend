import { IsString, IsNumber, IsOptional, IsIn } from 'class-validator';

export class UpdateMetodoPagoDto {
    @IsNumber()
    ideMetoPago: number;

    @IsOptional()
    @IsString()
    nombreTitular?: string;

    @IsOptional()
    @IsString()
    fechaExpiracion?: string;

    @IsOptional()
    @IsString()
    @IsIn(['si', 'no'])
    esPredeterminado?: string;

    @IsOptional()
    @IsString()
    alias?: string;

    @IsOptional()
    @IsString()
    usuaActua?: string;
}
