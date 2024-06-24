import { IsNotEmpty, IsString } from 'class-validator';

export class AddBookDto {
  @IsString()
  @IsNotEmpty()
  book_title: string;

  @IsString()
  @IsNotEmpty()
  book_author: string;

  @IsString()
  @IsNotEmpty()
  publisher_name: string;

  @IsString()
  @IsNotEmpty()
  publish_year: string;

  @IsString()
  @IsNotEmpty()
  rent: string;
}
