import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

function requiredText(value: unknown): unknown {
  if (typeof value !== 'string') {
    return value;
  }

  return value.trim();
}

export class CancelarPedidoDTO {
  @IsString()
  @Length(5, 250)
  @Transform(({ value }) => requiredText(value))
  motivoCancelacion!: string;
}
