import * as uuid from 'uuid';
import { Banner } from "../models/banner";
import { SetupConnections } from "../../../core/providers/setup-connections";
import { IBannersRepository } from "./i-banners-repository";
import { CreateBannersParams } from "../controllers/create-banners/create-banners-params";
import { IBucket } from "../../../core/providers/bucket/i-bucket";


export class MongoBannersRepository implements IBannersRepository {
  constructor(private readonly bucket: IBucket) { }

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

  async createBanners(params: CreateBannersParams): Promise<Banner> {
    const responseBucket = await this.bucket.uploadmultipleImagesToBucket("banners", params.images, uuid.v4());

    const { insertedId } = await SetupConnections.db
      .collection("banners")
      .insertOne({ "images": responseBucket });

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
