import { Brand } from "../models/brand";
import { IBrandRepository } from "./i-brand-repository";
import { IBucket } from "../../../core/providers/bucket/i-bucket";
import { SetupConnections } from "../../../core/providers/setup-connections";
import { CreateBrandParams } from "../controllers/create-brand/create-brand-params";
import { ObjectId } from "mongodb";

export class MongoBrandsRepository implements IBrandRepository {
    constructor(private readonly bucket: IBucket) { }

    async deleteBrand(id: string): Promise<Brand> {
        const brand = await SetupConnections.db
            .collection<Omit<Brand, "id">>("brands")
            .findOne({ _id: new ObjectId(id) });

        if (!brand) {
            throw Error("Brand not found.");
        }

        const { deletedCount } = await SetupConnections.db
            .collection("brands")
            .deleteOne({ _id: new ObjectId(id) });

        if (!deletedCount) {
            throw new Error("Brand not deleted");
        }

        const { _id, ...rest } = brand;

        // Delete bucket files
        this.bucket.deleteFiles("brands", _id.toHexString());

        return {
            id: _id.toHexString(),
            ...rest,
        };
    }

    async getBrands(): Promise<Brand[]> {
        const brands = await SetupConnections.db
            .collection<Omit<Brand, "id">>("brands")
            .find({})
            .toArray();

        return brands.map(({ _id, ...rest }) => ({
            ...rest,
            id: _id.toHexString(),
        }));
    }

    async createBrand(params: CreateBrandParams): Promise<Brand> {
        const { insertedId } = await SetupConnections.db
            .collection("brands")
            .insertOne({ name: params.name });

        //Update picture
        const responseBucket = await this.bucket.uploadSingleImageToBucket("brands", params.image, insertedId.toHexString());

        await SetupConnections.db.collection("brands").updateOne(
            { _id: insertedId },
            { $set: { logo: responseBucket } }
        );

        const brands = await SetupConnections.db
            .collection<Omit<Brand, "id">>("brands")
            .findOne({ _id: insertedId });

        if (!brands) {
            throw new Error("Brand not created");
        }

        const { _id, ...rest } = brands;
        return {
            id: _id.toHexString(),
            ...rest,
        };
    }
}
