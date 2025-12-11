import { ICliente } from '@models';
import { Transform } from 'class-transformer';
import { IsString, Length, IsEmail, Min, IsInt, Equals, IsNumberString, IsDateString, IsIn } from 'class-validator';

export class CreateClienteDTO implements ICliente {

    @IsInt()
    @Equals(-1)
    ideClie: number;

    @IsNumberString()
    @Length(7, 15)
    @Transform(({ value }) =>
        (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
    )
    cedulaClie: string;

    @IsDateString()
    fechaNacimientoClie :string;

    @IsInt()
    @Min(1)
    edadClie :number;

    @IsNumberString()
    @Length(7, 15)
    @Transform(({ value }) =>
        (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
    )
    telefonoClie :string;

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
    @IsIn(['si', 'no'])
    esSocio: 'si' | 'no';

     @IsString()
    @IsIn(['si', 'no'])
    esTerceraEdad: 'si' | 'no';

    @IsString()
    @Length(0, 50)
    @Transform(({ value }) =>
        (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : ''
    )
    segundoNombreClie: string;

    @IsString()
    @Length(0, 50)
    @Transform(({ value }) =>
        (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : ''
    )
    apellidoMaternoClie: string;

    toArray(): any[] {
        return [
            this.cedulaClie,
            this.fechaNacimientoClie,
            this.edadClie,
            this.telefonoClie,
            this.primerNombreClie,
            this.apellidoPaternoClie,
            this.emailClie,
            this.esSocio,
            this.esTerceraEdad,
            this.segundoNombreClie || null,
            this.apellidoMaternoClie || null
        ];
    }
}