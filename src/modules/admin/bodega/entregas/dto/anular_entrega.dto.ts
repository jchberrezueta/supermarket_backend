import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

function requiredText(value: unknown): string | unknown {
  if (typeof value !== 'string') {
    return value;
  }

  return value.trim();
}

export class AnularEntregaDTO {
  @IsString()
  @Length(5, 250)
  @Transform(({ value }) => requiredText(value))
  motivoAnulacion!: string;
}
