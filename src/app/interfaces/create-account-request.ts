/* Defining the interface for the request object. */
export interface CreateAccountObjectRequest {
  store: {
    name: string;
    category: string;
    phone: string;
    picture: string;
    banner: string;
  };
  account: {
    email: string;
    password: string;
  };
}
