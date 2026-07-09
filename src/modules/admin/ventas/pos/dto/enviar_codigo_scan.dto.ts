import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class EnviarCodigoScanDto {
  @IsString()
  @Length(1, 100)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  codigo!: string;

  @IsString()
  @Length(1, 100)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  scannerToken!: string;
}
