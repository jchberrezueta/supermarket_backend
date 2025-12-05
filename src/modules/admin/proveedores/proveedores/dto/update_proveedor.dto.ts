import { PartialType } from "@nestjs/mapped-types";
import { CreateProveedorDTO } from "./create_proveedor.dto";

export class UpdateProveedorDTO extends PartialType(CreateProveedorDTO) {}