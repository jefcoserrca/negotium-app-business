import { FormatColor } from '../interfaces/format-color';
import { ContactData } from '../interfaces/contact-data';
import {
  StructureRecommendations,
  StructureProducts,
} from '../interfaces/format-structure';
import { DeliveryZone } from '../interfaces/delivery-zone';
export class Store {
  id: string;
  name: string;
  banner: string;
  picture: string;
  category: string;
  phone: string;
  stripeAccount: string;
  typeAccount: 'free' | 'pro' | 'gold';
  activeTools: Tools;
  styles?: StoreStyles;
  contactData?: Array<ContactData>;
  categoryIcon?: string;
  delivery?: Delivery;
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
