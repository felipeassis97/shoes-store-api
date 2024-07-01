import { Brand } from "../../models/brand";
import { CreateBrandParams } from "./create-brand-params";
import { IBrandRepository } from "../../repositories/i-brand-repository";
import { badRequest, created, internalError, ok } from "../../../../core/helpers/helpers";
import { HttpRequest, HttpResponse, IController } from "../../../../core/protocols/protocols";

export class CreateBrandController implements IController {
    constructor(private readonly brandRepository: IBrandRepository) { }

    async handle(
        httpRequest: HttpRequest<CreateBrandParams>
    ): Promise<HttpResponse<Brand | string>> {
        try {
            const requiredFields = ["name"];

            // Validate body and file is not empty
            if (!httpRequest.file || !httpRequest.body) {
                return badRequest("Image file and brand name are required");
            }

            // Validate required fileds
            for (const field of requiredFields) {
                const value = httpRequest?.body?.[field as keyof CreateBrandParams];
                if (typeof value !== 'string' || !value.length) {
                    return badRequest(`Error: Field ${field} is required`);
                }
            }

            const { name } = httpRequest.body;
            const image = httpRequest.file;
            const params: CreateBrandParams = { name, image };
            const brand = await this.brandRepository.createBrand(params);

            return created(brand);
        } catch (error) {
            return internalError(`${error}`);
        }
    }
}
