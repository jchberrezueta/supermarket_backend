import { IFiltroRol } from "@models";
import { IsOptional, IsString, Length } from "class-validator";

export class FilterRolDTO implements IFiltroRol {

    @IsOptional()
    @IsString()
    @Length(1, 100)
    nombreRol?: string;

    @IsOptional()
    @IsString()
    @Length(1, 250)
    descripcionRol?: string;

    toArray(): any[] {
        return [
            this.nombreRol?? null,
            this.descripcionRol?? null  
        ];
    }
}