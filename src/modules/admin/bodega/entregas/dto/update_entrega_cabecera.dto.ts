import { PartialType } from '@nestjs/mapped-types';
import { CreateEntregaCabeceraDTO } from './create_entrega_cabecera.dto';

export class UpdateEntregaCabeceraDTO extends PartialType(CreateEntregaCabeceraDTO) {}