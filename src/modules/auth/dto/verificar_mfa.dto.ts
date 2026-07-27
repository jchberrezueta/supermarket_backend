import { IsNumber, IsString, Length } from 'class-validator';

export class VerificarMfaDto {
  @IsNumber()
  ideCuen!: number;

  @IsString()
  @Length(6, 6)
  codigo!: string;
}
