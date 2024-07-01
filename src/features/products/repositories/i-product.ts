import { Product } from "../models/product";
import { CreateProductParams } from "../controllers/create-product/create-product-params";

export interface IProductRepository {
    getProducts(): Promise<Product[]>
    deleteProduct(productId: string): Promise<Product>;
    getProductsByStoreId(storeId: string): Promise<Product[]>
    getProductsByBrandId(brandId: string): Promise<Product[]>
    createProduct(params: CreateProductParams): Promise<Product>;
}



