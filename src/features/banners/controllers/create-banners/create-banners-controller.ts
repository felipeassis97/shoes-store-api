import { Banner } from "../../models/banner";
import { CreateBannersParams } from "./create-banners-params";
import { IBannersRepository } from "../../repositories/i-banners-repository";
import { badRequest, created, internalError } from "../../../../core/helpers/helpers";
import { HttpRequest, HttpResponse, IController } from "../../../../core/protocols/protocols";

export class CreateBannersController implements IController {
    constructor(private readonly createBannerRepository: IBannersRepository) { }

    async handle(httpRequest: HttpRequest<CreateBannersParams>): Promise<HttpResponse<Banner[]>> {
        try {
            const images = httpRequest.files as Express.Multer.File[];

            if (!images || images.length === 0) {
                return badRequest("Image files is required");
            }
            if (images.length > 4) {
                return badRequest("Max 4 images");
            }

            const params = { images };
            const banner = await this.createBannerRepository.createBanners(params)
            return created(banner);
        } catch (error) {
            return internalError(`${error}`);
        }
    }
}
