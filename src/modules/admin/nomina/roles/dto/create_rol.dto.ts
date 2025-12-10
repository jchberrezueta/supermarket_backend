import { IRol } from "@models";
import { Transform } from "class-transformer";
import { Equals, IsInt, IsString, Length } from "class-validator";

export class CreateRolDTO implements IRol {

    @IsInt()
    @Equals(-1)
    ideRol: number;

    @IsString()
    @Length(1, 100)
    @Transform(({value}) => (
        (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
    ))
    nombreRol: string;

    @IsString()
    @Length(1, 250)
    @Transform(({value}) => (
        (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : 'ninguna'
    ))
    descripcionRol: string;

    toArray(): any[] {
        return [
            this.nombreRol,
            this.descripcionRol  
        ];
    }
}