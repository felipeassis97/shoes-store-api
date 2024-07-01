import { Brand } from "../models/brand";
import { CreateBrandParams } from "../controllers/create-brand/create-brand-params";

export interface IBrandRepository {
    getBrands(): Promise<Brand[]>;
    createBrand(params: CreateBrandParams): Promise<Brand>;
    deleteBrand(id: string): Promise<Brand>;
}
