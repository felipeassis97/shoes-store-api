import { ObjectId } from "mongodb";
import { Product } from "../models/product";
import { IProductRepository } from "./i-product";
import { IBucket } from "../../../core/providers/bucket/i-bucket";
import { SetupConnections } from "../../../core/providers/setup-connections";
import { CreateProductParams } from "../controllers/create-product/create-product-params";


export class MongoProductsRepository implements IProductRepository {
    constructor(private readonly bucket: IBucket) { }

    async createProduct(params: CreateProductParams): Promise<Product> {
        const { images, ...productData } = params;

        const { insertedId } = await SetupConnections.db
            .collection("products")
            .insertOne(productData);

        const responseBucket = await this.bucket.uploadmultipleImagesToBucket(`products/store_${params.store_id}/brand_${params.brand_id}`, images, insertedId.toHexString());

        await SetupConnections.db.collection("products").updateOne(
            { _id: insertedId },
            { $set: { images: responseBucket } }
        );

        const product = await SetupConnections.db
            .collection<Omit<Product, "id">>("products")
            .findOne({ _id: insertedId });

        if (!product) {
            throw new Error("Product not created");
        }

        const { _id, ...rest } = product;
        return {
            id: _id.toHexString(),
            ...rest,
        };
    }

    async deleteProduct(productId: string): Promise<Product> {
        const product = await SetupConnections.db
            .collection<Omit<Product, "id">>("products")
            .findOne({ _id: new ObjectId(productId) });

        if (!product) {
            throw Error("Product not found.");
        }

        const { deletedCount } = await SetupConnections.db
            .collection("products")
            .deleteOne({ _id: new ObjectId(productId) });

        if (!deletedCount) {
            throw new Error("Brand not deleted");
        }

        const { _id, ...rest } = product;

        // Delete bucket files
        this.bucket.deleteFiles(`products/store_${product.store_id}/brand_${product.brand_id}`, _id.toHexString());
        return {
            id: _id.toHexString(),
            ...rest,
        };
    }

    async getProducts(): Promise<Product[]> {
        const banners = await SetupConnections.db
            .collection<Omit<Product, "id">>("products")
            .find({})
            .toArray();

        return banners.map(({ _id, ...rest }) => ({
            ...rest,
            id: _id.toHexString(),
        }));
    }

    async getProductsByStoreId(storeId: string): Promise<Product[]> {
        const products = await SetupConnections.db
            .collection<Omit<Product, "id">>("products")
            .find({ store_id: storeId })
            .toArray();

        return products.map(({ _id, ...rest }) => ({
            ...rest,
            id: _id.toHexString(),
        }));
    }

    async getProductsByBrandId(brandId: string): Promise<Product[]> {
        const products = await SetupConnections.db
            .collection<Omit<Product, "id">>("products")
            .find({ brand_id: brandId })
            .toArray();

        return products.map(({ _id, ...rest }) => ({
            ...rest,
            id: _id.toHexString(),
        }));
    }
}