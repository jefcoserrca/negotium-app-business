import { FormatColor } from '../interfaces/format-color';
import { ContactData } from '../interfaces/contact-data';
import {
  StructureRecommendations,
  StructureProducts,
} from '../interfaces/format-structure';
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
}

export class StoreStyles {
  storeCard: FormatColor;
  topbar: FormatColor;
  content: FormatColor;
  navbar: FormatColor;
  structureHighlights: StructureRecommendations;
  structureProducts: StructureProducts;
  structureProductsByCategory: StructureProducts;
}
