import { Product } from "../models/product";
import { CreateProductParams } from "../controllers/create-product-params";

export interface IProductRepository {
    createProduct(params: CreateProductParams): Promise<Product>;
}



