
import { Banner } from "../../models/banner";
import { CreateBannerParams } from "./create-banner-params";
import { IBannersRepository } from "../../repositories/i-banners-repository";
import { badRequest, created, internalError } from "../../../../core/helpers/helpers";
import { HttpRequest, HttpResponse, IController } from "../../../../core/protocols/protocols";


export class CreateBannersController implements IController {
    constructor(private readonly createBannerRepository: IBannersRepository) { }

    async handle(
        httpRequest: HttpRequest<CreateBannerParams>
    ): Promise<HttpResponse<Banner | string>> {
        try {
            const requiredFields = ["imageUrl"];

            //Validate body
            if (!httpRequest.body) {
                return badRequest("Error: Body missing fields.");
            }

            //Validate required fields
            for (const field of requiredFields) {
                if (!httpRequest?.body?.[field as keyof CreateBannerParams]?.length) {
                    return badRequest(`Error: Field ${field} is required`);
                }
            }

            const user = await this.createBannerRepository.createBanners(
                httpRequest.body
            );
            return created(user);
        } catch (error) {
            return internalError(`${error}`);
        }
    }
}
