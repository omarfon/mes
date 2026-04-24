import { IsString, MinLength, IsOptional, IsBoolean, IsEmail } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @MinLength(1)
  ruc!: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
