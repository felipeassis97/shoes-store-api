import { Product } from "../../models/product";
import { IProductRepository } from "../../repositories/i-product";
import { badRequest, internalError, ok } from "../../../../core/helpers/helpers";
import { HttpRequest, HttpResponse, IController } from "../../../../core/protocols/protocols";

export class DeleteProductController implements IController {
    constructor(private readonly productRepository: IProductRepository) { }

    async handle(httpRequest: HttpRequest<string>): Promise<HttpResponse<Product>> {
        try {
            const id = httpRequest?.params?.id;

            if (!id) {
                return badRequest("Error: Missing brand id.");
            }

            const brand = await this.productRepository.deleteProduct(id);
            return ok(brand);

        } catch (error) {
            return internalError(`${error}`)
        }
    }
}