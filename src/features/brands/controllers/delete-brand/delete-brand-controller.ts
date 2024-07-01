import { badRequest, internalError, ok } from "../../../../core/helpers/helpers";
import { HttpRequest, HttpResponse, IController } from "../../../../core/protocols/protocols";
import { Brand } from "../../models/brand";
import { IBrandRepository } from "../../repositories/i-brand-repository";

export class DeleteBrandController implements IController {
    constructor(private readonly brandRepository: IBrandRepository) { }

    async handle(httpRequest: HttpRequest<string>): Promise<HttpResponse<Brand>> {
        try {
            const id = httpRequest?.params?.id;

            if (!id) {
                return badRequest("Error: Missing brand id.");
            }

            const brand = await this.brandRepository.deleteBrand(id);
            return ok(brand);

        } catch (error) {
            return internalError(`${error}`)
        }
    }
}