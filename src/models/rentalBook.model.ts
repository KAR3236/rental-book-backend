import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { Book } from './book.model';
import { CustomerDetails } from './customerDetails.model';
import { PaymentStatus } from 'src/utils/enum';

@Entity()
@Index('unique_composite', ['book_id', 'customer_id'], { unique: true })
export class RentalBook {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  book_id: number;

  @Column()
  customer_id: number;

  @Column({ enum: PaymentStatus, default: PaymentStatus.NOT_PAID })
  payment_status: PaymentStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  update_at: Date;

  @ManyToOne(() => Book, (book) => book.rental_book)
  book_: Book;

  @ManyToOne(
    () => CustomerDetails,
    (customerDetails) => customerDetails.rental_book,
  )
  customer_: CustomerDetails;
}
