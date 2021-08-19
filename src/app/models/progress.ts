export class UserProgress {
  products: boolean;
  store: boolean;
  qrCodes: boolean;
  coupons: boolean;
  orders: boolean;
  payments: boolean;

  toObj(): any {
    return {
      products: this.products,
      store: this.store,
      qrCodes: this.qrCodes,
      coupons: this.coupons,
      orders: this.orders ? this.orders : null,
      payments: this.payments ? this.payments : null,
    };
  }
}
