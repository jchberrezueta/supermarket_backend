import { IsNotEmpty, IsString } from 'class-validator';

export class EnviarCodigoScanDto {
  @IsString()
  @IsNotEmpty()
  codigo!: string;

  @IsString()
  @IsNotEmpty()
  scannerToken!: string;
}
