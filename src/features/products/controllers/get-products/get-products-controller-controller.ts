import { Product } from "../../models/product";
import { IProductRepository } from "../../repositories/i-product";
import { internalError, ok } from "../../../../core/helpers/helpers";
import { HttpResponse, IController } from "../../../../core/protocols/protocols";

export class GetProductsController implements IController {
    constructor(private readonly productRepository: IProductRepository) { }

    async handle(
    ): Promise<HttpResponse<Product[]>> {
        try {
            const products = await this.productRepository.getProducts();
            return ok(products);
        } catch (error) {
            return internalError(`${error}`);
        }
    }
}