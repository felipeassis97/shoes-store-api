import { Banner } from "../../models/banner";
import { IBannersRepository } from "../../repositories/i-banners-repository";
import { created, internalError } from "../../../../core/helpers/helpers";
import { HttpResponse, IController } from "../../../../core/protocols/protocols";


export class GetBannersController implements IController {
    constructor(private readonly createBannerRepository: IBannersRepository) { }

    async handle(
    ): Promise<HttpResponse<Banner | string>> {
        try {
            const user = await this.createBannerRepository.getBanners();
            return created(user);
        } catch (error) {
            return internalError(`${error}`);
        }
    }
}