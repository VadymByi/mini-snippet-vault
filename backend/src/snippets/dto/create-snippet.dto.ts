import {
  IsString,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateSnippetDto {
  @IsString()
  @IsNotEmpty({ message: 'Назва обовʼязкова' })
  title!: string;

  @IsString()
  @IsNotEmpty({ message: 'Контент не може бути порожнім' })
  content!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags!: string[];

  @IsEnum(['link', 'note', 'command'], { message: 'Невірний тип сніпету' })
  type!: string;
}
