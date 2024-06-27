import { ObjectId } from "mongodb";
import { Store } from "../models/store";
import { MongoClient } from "../../../core/database/mongo";
import { IStoresRepository } from "./i-stores-repository";
import { CreateStoresParams } from "../controllers/create-store/create-store-params";
import { UpdateStoreParams } from "../controllers/update-store/update-store-params";


export class MongoStoresRepository implements IStoresRepository {

    static storeCollection = "stores";

    async createStore(params: CreateStoresParams): Promise<Store> {
        const { insertedId } = await MongoClient.db
            .collection("stores")
            .insertOne(params);

        const user = await MongoClient.db
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
        const store = await MongoClient.db
            .collection<Omit<Store, "id">>("store")
            .findOne({ _id: new ObjectId(id) });

        if (!store) {
            throw Error("Store not found.");
        }

        const { deletedCount } = await MongoClient.db
            .collection("store")
            .deleteOne({ _id: new ObjectId(id) });

        if (!deletedCount) {
            throw new Error("Store not deleted");
        }

        const { _id, ...rest } = store;
        return {
            id: _id.toHexString(),
            ...rest,
        };
    }

    async getStores(): Promise<Store[]> {
        const stores = await MongoClient.db
            .collection<Omit<Store, "id">>("stores")
            .find({})
            .toArray();

        return stores.map(({ _id, ...rest }) => ({
            ...rest,
            id: _id.toHexString(),
        }));
    }

    async updateStore(id: string, params: UpdateStoreParams): Promise<Store> {
        await MongoClient.db.collection("stores").updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    ...params,
                },
            }
        );

        const user = await MongoClient.db
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
}