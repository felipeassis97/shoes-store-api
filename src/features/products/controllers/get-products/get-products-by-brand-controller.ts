import { Product } from "../../models/product";
import { IProductRepository } from "../../repositories/i-product";
import { badRequest, internalError, ok } from "../../../../core/helpers/helpers";
import { HttpRequest, HttpResponse, IController } from "../../../../core/protocols/protocols";

export class GetProductsByBrandController implements IController {
    constructor(private readonly productRepository: IProductRepository) { }

    async handle(httpRequest: HttpRequest<string>): Promise<HttpResponse<Product[]>> {
        try {
            const id = httpRequest?.params?.id;

            if (!id) {
                return badRequest("Error: Missing Brand id.");
            }

            const products = await this.productRepository.getProductsByBrandId(id);
            return ok(products);
        } catch (error) {
            return internalError(`${error}`);
        }
    }
}