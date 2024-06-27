import { Banner } from "../models/banner";
import { CreateBannerParams } from "../controllers/create-banners/create-banner-params";

export interface IBannersRepository {
    getBanners(): Promise<Banner[]>;
    createBanners(params: CreateBannerParams): Promise<Banner>;
}
