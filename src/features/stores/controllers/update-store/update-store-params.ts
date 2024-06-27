export interface UpdateStoreParams {
    name: string;
    description: string;
    logo: string;
    address: UpdateAddressParams;
}

export interface UpdateAddressParams {
    street: string;
    neighborhood: string;
    city: string;
    country: string;
    zipcode: string;
    lat: string;
    lng: string;
}