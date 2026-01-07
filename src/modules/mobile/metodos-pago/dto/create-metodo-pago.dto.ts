import { IsString, IsNumber, IsOptional, IsIn } from 'class-validator';

export class CreateMetodoPagoDto {
    @IsOptional()
    @IsNumber()
    ideClie?: number;

    @IsString()
    @IsIn(['tarjeta_credito', 'tarjeta_debito', 'paypal'])
    tipoPago: string;

    @IsString()
    nombreTitular: string;

    @IsOptional()
    @IsString()
    numeroTarjetaMasked?: string;

    @IsOptional()
    @IsString()
    @IsIn(['visa', 'mastercard', 'amex', 'diners'])
    marcaTarjeta?: string;

    @IsOptional()
    @IsString()
    fechaExpiracion?: string;

    @IsOptional()
    @IsString()
    emailPaypal?: string;

    @IsOptional()
    @IsString()
    @IsIn(['si', 'no'])
    esPredeterminado?: string;

    @IsOptional()
    @IsString()
    alias?: string;

    @IsOptional()
    @IsString()
    usuaIngre?: string;
}
