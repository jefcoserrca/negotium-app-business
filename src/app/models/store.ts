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
