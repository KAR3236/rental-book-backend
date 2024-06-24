import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerDetails } from 'src/models/customerDetails.model';
import { JwtModule } from '@nestjs/jwt';
import { Book } from 'src/models/book.model';
import { RentalBook } from 'src/models/rentalBook.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerDetails, Book, RentalBook]),
    // Here, Make configuration of JWT module for authentication.
    JwtModule.register({
      secret: 'JWTPrivateKey', // secret key for authnentication and use this secret key for authorization.
      signOptions: { expiresIn: '5h' }, // Here, Given expires time for token.
    }),
  ],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
