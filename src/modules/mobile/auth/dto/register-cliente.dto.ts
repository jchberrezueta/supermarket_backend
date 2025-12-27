import { Transform } from 'class-transformer';
import { IsString, Length, IsEmail, Min, IsInt, IsNumberString, IsDateString, IsIn, IsOptional } from 'class-validator';

export class RegisterClienteDto {

    @IsNumberString()
    @Length(7, 15)
    @Transform(({ value }) =>
        (typeof value === 'string' && value.trim() !== '') ? value.trim() : null
    )
    cedulaClie: string;

    @IsDateString()
    fechaNacimientoClie: string;

    @IsInt()
    @Min(1)
    edadClie: number;

    @IsNumberString()
    @Length(7, 15)
    @Transform(({ value }) =>
        (typeof value === 'string' && value.trim() !== '') ? value.trim() : null
    )
    telefonoClie: string;

    @IsString()
    @Length(1, 50)
    @Transform(({ value }) =>
        (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
    )
    primerNombreClie: string;

    @IsString()
    @Length(1, 50)
    @Transform(({ value }) =>
        (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
    )
    apellidoPaternoClie: string;

    @IsEmail()
    @Length(1, 100)
    @Transform(({ value }) =>
        (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
    )
    emailClie: string;

    @IsString()
    @Length(6, 255)
    password: string;

    @IsOptional()
    @IsString()
    @IsIn(['si', 'no'])
    esSocio?: 'si' | 'no' = 'no';

    @IsOptional()
    @IsString()
    @IsIn(['si', 'no'])
    esTerceraEdad?: 'si' | 'no' = 'no';

    @IsOptional()
    @IsString()
    @Length(1, 50)
    @Transform(({ value }) =>
        (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
    )
    segundoNombreClie?: string | null;

    @IsOptional()
    @IsString()
    @Length(1, 50)
    @Transform(({ value }) =>
        (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
    )
    apellidoMaternoClie?: string | null;

    /**
     * Retorna array para fn_insertar_cliente
     */
    toArrayCliente(): any[] {
        return [
            this.cedulaClie,
            this.fechaNacimientoClie,
            this.edadClie,
            this.telefonoClie,
            this.primerNombreClie,
            this.apellidoPaternoClie,
            this.emailClie,
            this.esSocio ?? 'no',
            this.esTerceraEdad ?? 'no',
            this.segundoNombreClie ?? null,
            this.apellidoMaternoClie ?? null
        ];
    }
}
