export interface Store {
  id: string;
  name: string;
  description: string;
  logo: string;
  address: Address;
}

export interface Address {
  street: string;
  neighborhood: string;
  city: string;
  country: string;
  zipcode: string;
  lat: string;
  lng: string;
}
