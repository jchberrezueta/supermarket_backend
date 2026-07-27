import { IsNumber, IsString, Length } from 'class-validator';

export class ActivarMfaDto {
  @IsNumber()
  ideCuen!: number;

  @IsString()
  @Length(6, 6)
  codigo!: string;
}
