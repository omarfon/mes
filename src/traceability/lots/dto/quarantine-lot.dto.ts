import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class QuarantineLotDto {
  @IsBoolean()
  @IsNotEmpty()
  isInQuarantine: boolean;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
