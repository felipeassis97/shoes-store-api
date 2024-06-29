import { Banner } from "../models/banner";
import { SetupConnections } from "../../../core/providers/setup-connections";
import { IBannersRepository } from "./i-banners-repository";
import { CreateBannerParams } from "../controllers/create-banners/create-banner-params";


export class MongoBannersRepository implements IBannersRepository {
  async getBanners(): Promise<Banner[]> {
    const banners = await SetupConnections.db
      .collection<Omit<Banner, "id">>("banners")
      .find({})
      .toArray();

    return banners.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toHexString(),
    }));
  }

  async createBanners(params: CreateBannerParams): Promise<Banner> {
    const { insertedId } = await SetupConnections.db
      .collection("banners")
      .insertOne(params);

    const banners = await SetupConnections.db
      .collection<Omit<Banner, "id">>("banners")
      .findOne({ _id: insertedId });

    if (!banners) {
      throw new Error("Banners not created");
    }

    const { _id, ...rest } = banners;
    return {
      id: _id.toHexString(),
      ...rest,
    };
  }
}
