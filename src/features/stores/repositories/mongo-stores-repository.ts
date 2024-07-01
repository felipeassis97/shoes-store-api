import { ObjectId } from "mongodb";
import { Store } from "../models/store";
import { IStoresRepository } from "./i-stores-repository";
import { IBucket } from "../../../core/providers/bucket/i-bucket";
import { SetupConnections } from "../../../core/providers/setup-connections";
import { FirebaseBucket } from "../../../core/providers/bucket/firebase-bucket";
import { UpdateStoreParams } from "../controllers/update-store/update-store-params";
import { CreateStoresParams } from "../controllers/create-store/create-store-params";
import { UploadStoreLogoParams } from "../controllers/upload-image/upload-store-logo-params";


export class MongoStoresRepository implements IStoresRepository {
    constructor(private readonly bucket: IBucket) { }

    static storeCollection = "stores";
    static bucket: IBucket = new FirebaseBucket();

    async createStore(params: CreateStoresParams): Promise<Store> {
        const { insertedId } = await SetupConnections.db
            .collection("stores")
            .insertOne(params);

        const user = await SetupConnections.db
            .collection<Omit<Store, "id">>("stores")
            .findOne({ _id: insertedId });

        if (!user) {
            throw new Error("Store not created");
        }

        const { _id, ...rest } = user;
        return {
            id: _id.toHexString(),
            ...rest,
        };
    }

    async deleteStore(id: string): Promise<Store> {
        const store = await SetupConnections.db
            .collection<Omit<Store, "id">>("store")
            .findOne({ _id: new ObjectId(id) });

        if (!store) {
            throw Error("Store not found.");
        }

        const { deletedCount } = await SetupConnections.db
            .collection("store")
            .deleteOne({ _id: new ObjectId(id) });

        if (!deletedCount) {
            throw new Error("Store not deleted");
        }

        const { _id, ...rest } = store;

        // Delete bucket files
        this.bucket.deleteFiles("stores", _id.toHexString());

        return {
            id: _id.toHexString(),
            ...rest,
        };
    }

    async getStores(): Promise<Store[]> {
        const stores = await SetupConnections.db
            .collection<Omit<Store, "id">>("stores")
            .find({})
            .toArray();

        return stores.map(({ _id, ...rest }) => ({
            ...rest,
            id: _id.toHexString(),
        }));
    }

    async updateStore(id: string, params: UpdateStoreParams): Promise<Store> {
        await SetupConnections.db.collection("stores").updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    ...params,
                },
            }
        );

        const user = await SetupConnections.db
            .collection<Omit<Store, "id">>("stores")
            .findOne({ _id: new ObjectId(id) });

        if (!user) {
            throw new Error("Store not updated");
        }

        const { _id, ...rest } = user;
        return {
            id: _id.toHexString(),
            ...rest,
        };
    }

    async uploadLogoImage(params: UploadStoreLogoParams): Promise<Store> {
        const responseBucket = await this.bucket.uploadSingleImageToBucket("stores", params.image, params.storeId);



        await SetupConnections.db.collection("stores").updateOne(
            { _id: new ObjectId(params.storeId) },
            { $set: { logo: responseBucket } }
        );



        const store = await SetupConnections.db
            .collection<Omit<Store, "id">>("stores")
            .findOne({ _id: new ObjectId(params.storeId) });

        if (!store) {
            throw new Error("Profile Picture not updated");
        }

        const { _id, ...rest } = store;
        return {
            id: _id.toHexString(),
            ...rest,
        };
    }
}