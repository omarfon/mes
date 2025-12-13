import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from 'src/master-data/users/entities/user.entity';


export class CreateAuthDto {
  @ApiProperty({ example: 'Juan', description: 'Nombre del usuario' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellido del usuario' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'juan@example.com', description: 'Correo electrónico del usuario' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    minLength: 6,
    description: 'Contraseña en texto plano. Luego se encripta con bcrypt.',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.OPERATOR,
    description: 'Rol asignado al usuario',
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    example: true,
    required: false,
    description: 'Estado del usuario (activo o no)',
  })
  @IsOptional()
  isActive?: boolean;
}
