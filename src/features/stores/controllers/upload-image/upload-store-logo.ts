import { Store } from "../../models/store";
import { UploadStoreLogoParams } from "./upload-store-logo-params";
import { IStoresRepository } from "../../repositories/i-stores-repository";
import { badRequest, internalError, ok } from "../../../../core/helpers/helpers";
import { HttpRequest, HttpResponse, IController } from "../../../../core/protocols/protocols";

export class UploadStoreLogo implements IController {
    constructor(private readonly storesRepository: IStoresRepository) { }

    async handle(httpRequest: HttpRequest<UploadStoreLogoParams>): Promise<HttpResponse<Store>> {
        try {
            if (!httpRequest.file || !httpRequest.body) {
                return badRequest("Image file and storeId are required");
            }

            const { storeId } = httpRequest.body;
            const image = httpRequest.file;
            const params: UploadStoreLogoParams = { storeId, image };
            const store = await this.storesRepository.uploadLogoImage(params);

            return ok(store);
        }
        catch (error) {
            return internalError(`${error}`);
        }
    }
}