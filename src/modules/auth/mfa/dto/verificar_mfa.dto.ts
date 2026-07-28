import { IsString, Length, Matches } from 'class-validator';

export class VerificarMfaDto {
  @IsString()
  @Length(20, 2000)
  mfaToken!: string;

  @IsString()
  @Matches(/^\d{6}$/)
  codigo!: string;
}
