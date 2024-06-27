export interface CreateStoresParams {
    name: string;
    description: string;
    logo: string;
    address: AddressParams;
}

export interface AddressParams {
    street: string;
    neighborhood: string;
    city: string;
    country: string;
    zipcode: string;
    lat: string;
    lng: string;
}