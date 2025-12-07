import { PartialType } from "@nestjs/mapped-types";
import { CreateRolDTO } from "./create_rol.dto";

export class UpdateRolDTO extends PartialType(CreateRolDTO) {}