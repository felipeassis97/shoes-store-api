import { Product } from "../models/product";
import { IProductRepository } from "./i-product";
import { IBucket } from "../../../core/providers/bucket/i-bucket";
import { SetupConnections } from "../../../core/providers/setup-connections";
import { CreateProductParams } from "../controllers/create-product-params";

export class MongoProductsRepository implements IProductRepository {
    constructor(private readonly bucket: IBucket) { }

    async createProduct(params: CreateProductParams): Promise<Product> {
        const { images, ...productData } = params;

        const { insertedId } = await SetupConnections.db
            .collection("products")
            .insertOne(productData);

        const responseBucket = await this.bucket.uploadmultipleImagesToBucket("products", images, insertedId.toHexString());

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
}