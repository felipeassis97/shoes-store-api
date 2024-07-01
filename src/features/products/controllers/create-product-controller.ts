import { Product } from "../models/product";
import { CreateProductParams } from "./create-product-params";
import { IProductRepository } from "../repositories/i-product";
import { badRequest, internalError, ok } from "../../../core/helpers/helpers";
import { HttpRequest, HttpResponse, IController } from "../../../core/protocols/protocols";

export class CreateProductController implements IController {
    constructor(private readonly productRepository: IProductRepository) { }

    async handle(httpRequest: HttpRequest<CreateProductParams>): Promise<HttpResponse<Product>> {
        const body = httpRequest.body;
        const files = httpRequest.files as Express.Multer.File[];

        const requiredFields = ["store_id", "brand_id", "title", "description", "genre", "price", "sizes"];

        try {
            if (!body) {
                return badRequest("Body can nao be empty");
            }

            for (const field of requiredFields) {
                const value = httpRequest?.body?.[field as keyof CreateProductParams];
                if (typeof value !== 'string' || !value.length) {
                    return badRequest(`Error: Field ${field} is required`);
                }
            }

            if (!files || files.length === 0) {
                return badRequest("Product images is required");
            }

            if (files.length > 4) {
                return badRequest("The number of attached images cannot be greater than 4");
            }

            const params: CreateProductParams = { ...body, images: files };
            const product = await this.productRepository.createProduct(params);
            return ok(product);
        }
        catch (error) {
            return internalError(`${error}`);
        }
    }
}
