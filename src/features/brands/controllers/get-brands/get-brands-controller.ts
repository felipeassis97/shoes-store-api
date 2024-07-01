import { Brand } from "../../models/brand";
import { badRequest, internalError, ok } from "../../../../core/helpers/helpers";
import { IBrandRepository } from "../../repositories/i-brand-repository";
import { HttpRequest, HttpResponse, IController } from "../../../../core/protocols/protocols";

export class GetBrandsController implements IController {
    constructor(private readonly brandRepository: IBrandRepository) { }

    async handle(): Promise<HttpResponse<Brand[]>> {
        try {
            const brands = await this.brandRepository.getBrands();
            return ok(brands);
        } catch (error) {
            return internalError(`${error}`);
        }
    }
}