import { Banner } from "../models/banner";
import { MongoClient } from "../../../core/database/mongo";
import { IBannersRepository } from "./i-banners-repository";
import { CreateBannerParams } from "../controllers/create-banners/create-banner-params";


export class MongoBannersRepository implements IBannersRepository {
  async getBanners(): Promise<Banner[]> {
    const banners = await MongoClient.db
      .collection<Omit<Banner, "id">>("banners")
      .find({})
      .toArray();

    return banners.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toHexString(),
    }));
  }

  async createBanners(params: CreateBannerParams): Promise<Banner> {
    const { insertedId } = await MongoClient.db
      .collection("banners")
      .insertOne(params);

    const banners = await MongoClient.db
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
