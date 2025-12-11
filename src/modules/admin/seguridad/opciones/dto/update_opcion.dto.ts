import { IsInt, Min } from "class-validator";
import { CreateOpcionDto } from "./create_opcion.dto";

export class UpdateOpcionDto extends CreateOpcionDto {
    @IsInt()
    @Min(0)
    ideOpci: number;

    toArray (): any[]  {
        const lista = super.toArray();
        lista.unshift(this.ideOpci);
        return lista;
    };
}