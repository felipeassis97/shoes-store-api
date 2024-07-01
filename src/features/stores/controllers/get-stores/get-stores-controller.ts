import { internalError, ok } from "../../../../core/helpers/helpers";
import { HttpResponse, IController } from "../../../../core/protocols/protocols";
import { Store } from "../../models/store";
import { IStoresRepository } from "../../repositories/i-stores-repository";

export class GetStoresController implements IController {
  constructor(private readonly storeRepository: IStoresRepository) { }

  async handle(): Promise<HttpResponse<Store[]>> {
    try {
      const stores = await this.storeRepository.getStores();
      return ok(stores);

    } catch (error) {
      return internalError(`${error}`);
    }
  }
}
