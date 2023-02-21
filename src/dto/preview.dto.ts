import { IsNotEmpty, IsString } from 'class-validator';

export class PreviewDto {
  @IsNotEmpty()
  url!: string;

  @IsNotEmpty()
  filename!: string;

  type?: string;

  @IsNotEmpty()
  configId!: string;
}
