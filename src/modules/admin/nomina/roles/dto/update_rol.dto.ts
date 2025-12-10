import { IsInt, Min } from "class-validator";
import { CreateRolDTO } from "./create_rol.dto";

export class UpdateRolDTO extends (CreateRolDTO) {
    
    @IsInt()
    @Min(0)
    ideRol: number;

    toArray (): any[]  {
        const lista = super.toArray();
        lista.unshift(this.ideRol);
        return lista;
    };

}