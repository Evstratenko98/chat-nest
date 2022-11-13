import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class RegistrationDto {
  @IsNotEmpty()
  @IsString()
  public login: string;

  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  public password: string;

  @IsNotEmpty()
  @IsNumber()
  public age: number;
}
