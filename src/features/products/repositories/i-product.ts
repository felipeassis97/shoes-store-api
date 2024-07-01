import { Product } from "../models/product";
import { CreateProductParams } from "../controllers/create-product/create-product-params";

export interface IProductRepository {
    createProduct(params: CreateProductParams): Promise<Product>;
    deleteProduct(productId: string): Promise<Product>;
}



