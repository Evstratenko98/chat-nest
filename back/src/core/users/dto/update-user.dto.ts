import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  public age: number;

  @IsOptional()
  public name: string;
}
