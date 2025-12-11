import { IAccesoUsuario } from '@models';
import { Transform } from 'class-transformer';
import { IsOptional, IsInt, IsString, Min, Max, IsEnum, IsNumber, Length, IsDateString, Equals } from 'class-validator';


export class CreateAccesoUsuarioDto implements IAccesoUsuario{

    @IsInt()
    @Equals(-1)
    ideAcce: number;

    @IsInt()
    @Min(0)
    ideCuen: number;

    @IsString()
    @Length(1, 250)
    @Transform(({ value }) =>
        (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
    )
    navegadorAcce: string;

    @IsDateString()
    fechaAcce: string;

    @IsInt()
    @Min(0)
    numIntFallAcce: number;

    @IsString()
    @Length(1, 15)
    @Transform(({ value }) =>
        (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
    )
    ipAcce: string;

    @IsNumber()
    latitudAcce: number;

    @IsNumber()
    longitudAcce: number;

    toArray(): any[] {
        return [
            this.ideCuen,
            this.navegadorAcce,
            this.fechaAcce,
            this.numIntFallAcce,
            this.ipAcce,
            this.latitudAcce,
            this.longitudAcce
        ]
    }

}