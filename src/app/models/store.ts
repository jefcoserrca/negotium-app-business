import { FormatColor } from '../interfaces/format-color';
import { ContactData } from '../interfaces/contact-data';
import {
  StructureRecommendations,
  StructureProducts,
} from '../interfaces/format-structure';
import { DeliveryZone } from '../interfaces/delivery-zone';
import { ShippingData } from '../interfaces/store-shipping';
export class Store {
  activeTools: Tools;
  banner: string;
  category: string;
  categoryIcon?: string;
  contactData?: Array<ContactData>;
  delivery?: Delivery;
  id: string;
  name: string;
  phone: string;
  picture: string;
  shipping?: Shipping;
  stripeAccount?: string;
  stripeCustomer: string;
  stripeData?: StripeData;
  styles?: StoreStyles;
  typeAccount: 'free' | 'pro' | 'vip';
}

export class Tools {
  digitalMenu: boolean;
  couponSystem: boolean;
  qrCode: boolean;
  whatsappOrders?: boolean;
  deliverySystem?: boolean;
  customStore?: boolean;
  customDomain?: boolean;
  payments?: boolean;
}

export class StoreSimpleData {
  name: string;
  picture: string;
  banner: string;
  phone: string;
  category: string;
}

export class StoreStyles {
  storeCard: FormatColor;
  topbar: FormatColor;
  content: FormatColor;
  navbar: FormatColor;
  structureHighlights: StructureRecommendations;
  structureProducts: StructureProducts;
  structureProductsByCategory: StructureProducts;
  linearGradient: string;
}

export class Delivery {
  deliveryCost: number;
  minPurchaseAmount: number;
  freeShippingAmount: number;
  zones: Array<DeliveryZone>;
  isActive: boolean;

  toObj(): any {
    return {
      deliveryCost: this.deliveryCost,
      minPurchaseAmount: this.minPurchaseAmount,
      zones: this.zones,
      isActive: this.isActive,
    };
  }
}

export class Shipping {
  isActive: boolean;
  shippings: Array<ShippingData>;

  toObj?(): any {
    return {
      isActive: this.isActive,
      shippings: this.shippings,
    };
  }
}

export class StripeData {
  payoutsEnabled: boolean;
  chargesEnabled: boolean;
  isActive: boolean;

  toObj?(): any {
    return {
      payoutsEnabled: this.payoutsEnabled,
      chargesEnabled: this.chargesEnabled,
      isActive: this.isActive,
    };
  }
}
