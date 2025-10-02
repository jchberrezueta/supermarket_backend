import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsDate, IsNotEmpty, Length, IsEmail, Min } from 'class-validator';

export class CreateClienteDTO {

    @IsString()
    @IsNotEmpty()
    @Length(10, 15, {message: 'La Cedula debe tener entre 10 y 15 caracteres'})
    @Transform(({value}) => value.trim())
    public readonly cedula:string;

    @IsDate({message: 'Formato de fecha invalida'})
    @Type(() => Date)
    public readonly fechaNacimiento:Date;

    @IsNumber()
    @IsNotEmpty()
    @Min(1, {message: 'Edad Minimo 1'})
    public readonly edad:number;

    @IsString()
    @IsNotEmpty()
    @Length(10, 15, {message: 'El telefono debe tener entre 10 y 15 caracteres'})
    @Transform(({value}) => value.trim())
    public readonly telefono:string;

    @IsString()
    @IsNotEmpty()
    @Length(2, 50, {message: 'El primerNombre debe tener entre 2 y 50 caracteres'})
    @Transform(({value}) => value.trim())
    public readonly primerNombre:string;

    @IsString()
    @IsNotEmpty()
    @Length(2, 50, {message: 'El apellidoPaterno debe tener entre 2 y 50 caracteres'})
    @Transform(({value}) => value.trim())
    public readonly apellidoPaterno:string;

    @IsString()
    @IsNotEmpty()
    @IsEmail({}, {message: 'Email invalido'})
    @Transform(({value}) => value.trim())
    public readonly  email:string;

    @IsString()
    @IsNotEmpty()
    @Length(2, 2, {message: 'El esSocio debe tener solo 2 caracteres'})
    @Transform(({value}) => value.trim())
    public readonly esSocio:string;

    @IsString()
    @IsNotEmpty()
    @Length(2, 2, {message: 'El esTerceraEdad debe tener solo 2 caracteres'})
    @Transform(({value}) => value.trim())
    public readonly esTerceraEdad:string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(2, 50, {message: 'El segundoNombre debe tener entre 2 y 50 caracteres'})
    @Transform(({value}) => value.trim())
    public readonly segundoNombre?:string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(2, 50, {message: 'El apellidoMaterno debe tener entre 2 y 50 caracteres'})
    @Transform(({value}) => value.trim())
    public readonly apellidoMaterno?:string;
}