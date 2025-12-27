import { Transform } from 'class-transformer';
import { IsString, Length, IsEmail, IsNumberString, IsDateString, IsIn, IsOptional } from 'class-validator';

export class UpdateClienteDto {

    @IsOptional()
    @IsNumberString()
    @Length(7, 15)
    @Transform(({ value }) =>
        (typeof value === 'string' && value.trim() !== '') ? value.trim() : null
    )
    cedulaClie?: string;

    @IsOptional()
    @IsDateString()
    fechaNacimientoClie?: string;

    @IsOptional()
    @IsNumberString()
    @Length(7, 15)
    @Transform(({ value }) =>
        (typeof value === 'string' && value.trim() !== '') ? value.trim() : null
    )
    telefonoClie?: string;

    @IsOptional()
    @IsString()
    @Length(1, 50)
    @Transform(({ value }) =>
        (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
    )
    primerNombreClie?: string;

    @IsOptional()
    @IsString()
    @Length(1, 50)
    @Transform(({ value }) =>
        (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
    )
    apellidoPaternoClie?: string;

    @IsOptional()
    @IsEmail()
    @Length(1, 100)
    @Transform(({ value }) =>
        (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
    )
    emailClie?: string;

    @IsOptional()
    @IsString()
    @IsIn(['si', 'no'])
    esSocio?: 'si' | 'no';

    @IsOptional()
    @IsString()
    @IsIn(['si', 'no'])
    esTerceraEdad?: 'si' | 'no';

    @IsOptional()
    @IsString()
    @Length(1, 50)
    @Transform(({ value }) =>
        (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
    )
    segundoNombreClie?: string;

    @IsOptional()
    @IsString()
    @Length(1, 50)
    @Transform(({ value }) =>
        (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
    )
    apellidoMaternoClie?: string;
}
