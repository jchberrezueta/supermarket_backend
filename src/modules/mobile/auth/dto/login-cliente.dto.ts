import { IsString, Length, IsInt, Min } from 'class-validator';

export class LoginClienteDto {

    @IsString()
    @Length(1, 50)
    usuario: string;

    @IsString()
    @Length(1, 255)
    clave: string;

    @IsInt()
    @Min(0)
    numIntentos: number;
}
