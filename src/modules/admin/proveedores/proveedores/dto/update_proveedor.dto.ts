import { IsInt, Min } from "class-validator";
import { CreateProveedorDTO } from "./create_proveedor.dto";

export class UpdateProveedorDTO extends CreateProveedorDTO {
    
    @IsInt()
    @Min(0)
    ideProv: number;

    toArray(): any[]  {
        const lista = super.toArray();
        lista.unshift(this.ideProv);
        return lista;
    };
}