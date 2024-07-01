import { Banner } from "../models/banner";
import { CreateBannersParams } from "../controllers/create-banners/create-banners-params";

export interface IBannersRepository {
    getBanners(): Promise<Banner[]>;
    createBanners(params: CreateBannersParams): Promise<Banner>;
}
