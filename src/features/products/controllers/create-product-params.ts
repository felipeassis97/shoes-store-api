export interface CreateProductParams {
    store_id: string;
    brand_id: string;
    title: string;
    description: string;
    genre: string;
    price: number;
    sizes: string[];
    images: Express.Multer.File[];
}
