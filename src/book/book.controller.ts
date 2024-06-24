import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BookService } from './book.service';
import { LoginCustomerDto } from './dto/login-customer.dto';
import { ResponseInterface } from 'src/utils/interfaces/commonInterface';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { PaymentDto } from './dto/payment.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddBookDto } from './dto/add-book.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // Customer can register.
  @Post('login')
  login(@Body() loginUserDto: LoginCustomerDto): Promise<ResponseInterface> {
    return this.bookService.login(loginUserDto);
  }

  //Add Book API.
  // Guards for authorization.
  @UseGuards(JwtAuthGuard)
  @Post('add-book')
  @UseInterceptors(FileInterceptor('file'))
  addBook(
    @Body() addBookDto: AddBookDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseInterface> {
    return this.bookService.addBook(addBookDto, file);
  }

  // Customer can view all books.
  // Guards for authorization.
  @UseGuards(JwtAuthGuard)
  @Get('list-of-books')
  listOfBooks(): Promise<ResponseInterface> {
    return this.bookService.listOfBooks();
  }

  // Customer can add book on rent.
  // Guards for authorization.
  @UseGuards(JwtAuthGuard)
  @Get('add-book-on-rent/:book_id')
  addBookOnRent(
    @Request() request,
    @Param() params: any,
  ): Promise<ResponseInterface> {
    return this.bookService.addBookOnRent(request, params);
  }

  // Customer can view their rented book.
  // Guards for authorization.
  @UseGuards(JwtAuthGuard)
  @Get('view-book-on-rent')
  viewBookOnRent(@Request() request): Promise<ResponseInterface> {
    return this.bookService.viewBookOnRent(request);
  }

  // Customer can view their cart list.
  // Guards for authorization.
  @UseGuards(JwtAuthGuard)
  @Get('cart-list')
  cartList(@Request() request): Promise<ResponseInterface> {
    return this.bookService.cartList(request);
  }

  // Customer can pay their amount.
  // Guards for authorization.
  @UseGuards(JwtAuthGuard)
  @Post('payment')
  paymentProccess(@Body() paymentDto: PaymentDto): Promise<ResponseInterface> {
    return this.bookService.paymentProccess(paymentDto);
  }
}
