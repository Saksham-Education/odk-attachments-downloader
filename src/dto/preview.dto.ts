import { IsNotEmpty, IsString } from 'class-validator';

export class PreviewDto {
  @IsNotEmpty()
  @IsString()
  url!: string;

  @IsNotEmpty()
  @IsString()
  filename!: string;

  @IsString()
  type?: string;

  @IsNotEmpty()
  @IsString()
  configId!: string;
}
