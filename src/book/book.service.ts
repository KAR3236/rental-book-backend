import { Injectable } from '@nestjs/common';
import { LoginCustomerDto } from './dto/login-customer.dto';
import { LoginInterface } from 'src/utils/interfaces/customerInterface';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerDetails } from 'src/models/customerDetails.model';
import { QueryFailedError, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { handelResponse } from 'src/utils/handleResponse';
import { message } from 'src/utils/messages';
import { Book } from 'src/models/book.model';
import {
  BookInterface,
  RentalBookInterface,
} from 'src/utils/interfaces/bookInterface';
import { RentalBook } from 'src/models/rentalBook.model';
import Stripe from 'stripe';
import { PaymentStatus } from 'src/utils/enum';
import { PaymentDto } from './dto/payment.dto';
import { AddBookDto } from './dto/add-book.dto';

@Injectable()
export class BookService {
  private stripe;

  constructor(
    @InjectRepository(CustomerDetails)
    private customerDetailsModel: Repository<CustomerDetails>,
    @InjectRepository(Book)
    private bookModel: Repository<Book>,
    @InjectRepository(RentalBook)
    private rentalBookModel: Repository<RentalBook>,
    private jwtService: JwtService,
  ) {
    this.stripe = new Stripe(process.env.API_SECRET_KEY);
  }

  async login(loginUserDto: LoginCustomerDto) {
    try {
      const customerData: LoginInterface =
        await this.customerDetailsModel.findOne({
          where: {
            email: loginUserDto.email,
          },
        });

      if (customerData) {
        const comparedPassword: boolean = await bcrypt.compare(
          loginUserDto.password,
          customerData.password,
        );

        if (comparedPassword) {
          const token: string = await this.jwtService.signAsync({
            id: customerData.id,
          });

          return handelResponse({
            statusCode: 200,
            message: `Customer ${message.LOGIN_SUCCESSFULLY}`,
            data: {
              token,
            },
          });
        } else {
          return handelResponse({
            statusCode: 400,
            message: `Customer password ${message.NOT_MATCHED}`,
          });
        }
      } else {
        return handelResponse({
          statusCode: 404,
          message: `${message.EMAIL_NOT_FOUND}`,
        });
      }
    } catch (error) {
      return handelResponse({
        statusCode: 500,
        message: error.message,
      });
    }
  }

  async addBook(dto: AddBookDto, file: Express.Multer.File) {
    try {
      if (file) {
        const bookData: any = await this.bookModel.save({
          ...dto,
          book_image: file.filename,
        });

        if (bookData) {
          return handelResponse({
            statusCode: 201,
            message: `Book ${message.ADDED_SUCCESSFULLY}`,
          });
        }
      }
    } catch (error) {
      return handelResponse({
        statusCode: 500,
        message: message.PLEASE_TRY_AGAIN,
      });
    }
  }

  async listOfBooks() {
    try {
      const bookData: BookInterface[] = await this.bookModel.find();

      return handelResponse({
        statusCode: 200,
        message: `Book ${message.VIEW_SUCCESSFULLY}`,
        data: bookData,
      });
    } catch (error) {
      return handelResponse({
        statusCode: 500,
        message: error.message,
      });
    }
  }

  async addBookOnRent(req: any, params: any) {
    try {
      const rentalBookData: RentalBookInterface =
        await this.rentalBookModel.save({
          book_id: params.book_id,
          customer_id: req.user.id,
          rent_status: true,
        });

      if (rentalBookData) {
        return handelResponse({
          statusCode: 201,
          message: `Rental Book ${message.ADDED_SUCCESSFULLY}`,
        });
      }
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const detail = error.driverError.detail;
        if (detail && detail.includes('already exists')) {
          return handelResponse({
            statusCode: 400,
            message: 'Book already exists.',
          });
        } else {
          return handelResponse({
            statusCode: 500,
            message: error.message,
          });
        }
      } else {
        return handelResponse({
          statusCode: 500,
          message: error.message,
        });
      }
    }
  }

  async viewBookOnRent(req: any) {
    try {
      const rentalBookData: any[] = await this.bookModel.find({
        relations: ['rental_book'],
        where: {
          rental_book: {
            customer_id: req.user.id,
          },
        },
      });

      return handelResponse({
        statusCode: 200,
        message: `Rental Book ${message.VIEW_SUCCESSFULLY}`,
        data: rentalBookData,
      });
    } catch (error) {
      return handelResponse({
        statusCode: 500,
        message: error.message,
      });
    }
  }

  async cartList(req: any) {
    try {
      const rentalBookData: any[] = await this.bookModel.find({
        relations: ['rental_book'],
        where: {
          rental_book: {
            customer_id: req.user.id,
            payment_status: PaymentStatus.NOT_PAID,
          },
        },
      });

      return handelResponse({
        statusCode: 200,
        message: `Cart list ${message.VIEW_SUCCESSFULLY}`,
        data: rentalBookData,
      });
    } catch (error) {
      return handelResponse({
        statusCode: 500,
        message: error.message,
      });
    }
  }

  async paymentProccess(paymentDto: PaymentDto) {
    try {
      const { amount, currency } = paymentDto;
      const paymentIntentResponse = await this.stripe.paymentIntents.create({
        amount,
        currency,
      });

      if (paymentIntentResponse) {
        return handelResponse({
          statusCode: 201,
          message: `${message.PAYMENT_INTENT_SUCCESSFULLY}`,
          data: paymentIntentResponse,
        });
      }
    } catch (error) {
      return handelResponse({
        statusCode: 500,
        message: error.message,
      });
    }
  }
}
