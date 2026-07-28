import { IsString, Matches } from 'class-validator';

export class ActivarMfaDto {
  @IsString()
  @Matches(/^\d{6}$/)
  codigo!: string;
}
