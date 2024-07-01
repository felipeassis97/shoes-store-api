import { Store } from "../../models/store";
import { IStoresRepository } from "../../repositories/i-stores-repository";
import { badRequest, internalError, ok } from "../../../../core/helpers/helpers";
import { HttpRequest, HttpResponse, IController } from "../../../../core/protocols/protocols";

export class GetStoreController implements IController {
    constructor(private readonly storeRepository: IStoresRepository) { }

    async handle(httpRequest: HttpRequest<string>): Promise<HttpResponse<Store>> {
        try {
            const id = httpRequest?.params?.id;

            if (!id) {
                return badRequest("Error: Missing store id.");
            }
            const store = await this.storeRepository.getStoreById(id);

            return ok(store);
        } catch (error) {
            return internalError(`${error}`);
        }
    }
}