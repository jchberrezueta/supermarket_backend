import { IsNumber } from 'class-validator';

export class GenerarMfaDto {
  @IsNumber()
  ideCuen!: number;
}
