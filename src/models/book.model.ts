import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { RentalBook } from './rentalBook.model';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  book_image: string;

  @Column()
  book_title: string;

  @Column()
  book_author: string;

  @Column()
  publisher_name: string;

  @Column()
  publish_year: string;

  @Column()
  rent: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  update_at: Date;

  @OneToMany(() => RentalBook, (rentalBook) => rentalBook.book_)
  rental_book: RentalBook[];
}
