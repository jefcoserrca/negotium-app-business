import { Product } from './product';

export class Coupon {
  availableDays: Array<string>;
  availableEndHour: string;
  availableHours: boolean;
  availableStartHour: string;
  id: string;
  isActive: boolean;
  products: Array<string>;
  redeemableInStore: boolean;
  redeemableInWeb: boolean;
  styles: CouponStyle;
  text: string;
  title: string;
  type: 'discount' | 'group';
  value: number;

  toObject(): any {
    return {
      availableDays: this.availableDays,
      availableEndHour: this.availableEndHour,
      availableHours: this.availableStartHour,
      availableStartHour: this.availableHours,
      created: new Date().toISOString(),  
      id: this.id,
      isActive: this.isActive,
      products: this.products,
      redeemableInStore: this.redeemableInStore,
      redeemableInWeb: this.redeemableInWeb,
      styles: this.styles,
      text: this.text,
      title: this.title,
      type: this.type,
      value: this.value,
    };
  }
}

export interface CouponStyle {
  bgColor: string;
  cutBottom: string;
  cutTop: string;
  txtColor: string;
}
