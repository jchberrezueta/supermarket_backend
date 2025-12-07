import { PartialType } from '@nestjs/mapped-types';
import { CreateEmpleadoDTO } from './create_empleado.dto';

export class UpdateEmpleadoDTO extends PartialType(CreateEmpleadoDTO) {}