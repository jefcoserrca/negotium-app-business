import { Product } from './product';
export class Sale {
  amount: number;
  client?: string;
  date: string;
  products?: Array<Product>;
  type: 'cash' | 'debit' | 'credit' | 'online';

  toObj?(): any {
    return {
      amount: this.amount,
      client: this.client ? this.client : null,
      date: this.date,
      products: this.products.map((product) => product.toObject()),
      type: this.type,
    };
  }
}
