export class User {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  picture: string;
  banner: string;
  email: string;
  emailVerified: boolean;
  provider: Array<string>;
  token: string;
  isNewUser: boolean;
  subscription: 'free' | 'pro' | 'vip';
  stripeCustomer: string;
  subscriptionId: string;
  subscriptionStatus: string;
}
