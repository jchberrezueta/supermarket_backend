import { IsInt, Min } from "class-validator";
import { CreateOpcionDto } from "./create_opcion.dto";

export class UpdateOpcionDto extends CreateOpcionDto {
    @IsInt()
    @Min(0)
    ideOpci: number;

    toArray (): any[]  {
        const lista = super.toArray();
        // Remover el último elemento (null de p_usua_ingre) antes de agregar elementos
        lista.pop();
        lista.unshift(this.ideOpci);
        lista.push(null); // p_usua_actua
        return lista;
    };
}