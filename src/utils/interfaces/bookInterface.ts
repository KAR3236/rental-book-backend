export interface BookInterface {
  id?: number;
  book_title: string;
  book_author: string;
  publisher_name: string;
  publish_year: string;
  rent: string;
}

export interface RentalBookInterface {
  id?: number;
  book_id: number;
  customer_id: number;
  rent_status: boolean;
}
