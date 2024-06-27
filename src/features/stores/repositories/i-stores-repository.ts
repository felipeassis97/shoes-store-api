import { Store } from "../models/store";
import { CreateStoresParams } from "../controllers/create-store/create-store-params";
import { UpdateStoreParams } from "../controllers/update-store/update-store-params";


export interface IStoresRepository {
    getStores(): Promise<Store[]>;
    deleteStore(id: string): Promise<Store>;
    createStore(params: CreateStoresParams): Promise<Store>;
    updateStore(id: string, params: UpdateStoreParams): Promise<Store>;
}



