import { IsOptional, IsString, Length, IsNumberString, IsIn, IsEmail } from 'class-validator';
import { IFiltroCliente } from '@models';

export class FilterClienteDTO implements IFiltroCliente {

    @IsOptional()
    @IsNumberString()
    @Length(7, 15)
    cedulaClie?: string;

    @IsOptional()
    @IsString()
    @Length(1, 50)
    primerNombreClie?: string;

    @IsOptional()
    @IsString()
    @Length(1, 50)
    apellidoPaternoClie?: string;
    
    @IsOptional()
    @IsString()
    @IsIn(['si', 'no'])
    esSocio: 'si' | 'no';

    @IsOptional()
    @IsString()
    @IsIn(['si', 'no'])
    esTerceraEdad: 'si' | 'no';

    toArray(): any[] {
        return [
            this.cedulaClie ?? null,
            this.primerNombreClie ?? null,
            this.apellidoPaternoClie ?? null,
            this.esSocio ?? null,
            this.esTerceraEdad ?? null,
        ];
    }
}
