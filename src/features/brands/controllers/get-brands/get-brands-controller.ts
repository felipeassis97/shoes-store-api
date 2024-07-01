import { Brand } from "../../models/brand";
import { IBrandRepository } from "../../repositories/i-brand-repository";
import { created, internalError } from "../../../../core/helpers/helpers";
import { HttpResponse, IController } from "../../../../core/protocols/protocols";

export class GetBrandsController implements IController {
    constructor(private readonly brandRepository: IBrandRepository) { }

    async handle(): Promise<HttpResponse<Brand | string>> {
        try {
            const brands = await this.brandRepository.getBrands();
            return created(brands);
        } catch (error) {
            return internalError(`${error}`);
        }
    }
}