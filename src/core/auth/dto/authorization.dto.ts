import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthorizationDto {
  @IsNotEmpty()
  @IsString()
  public login: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  public password: string;
}
