import { Store } from "../../models/store";
import { IStoresRepository } from "../../repositories/i-stores-repository";
import { badRequest, internalError, ok } from "../../../../core/helpers/helpers";
import { HttpRequest, HttpResponse, IController } from "../../../../core/protocols/protocols";

export class DeleteStoreController implements IController {
  constructor(private readonly deleteUserRepository: IStoresRepository) { }
  async handle(httpRequest: HttpRequest<string>): Promise<HttpResponse<Store>> {
    try {
      const id = httpRequest?.params?.id;

      if (!id) {
        return badRequest("Error: Missing user id.");
      }

      const user = await this.deleteUserRepository.deleteStore(id);
      return ok(user);

    } catch (error) {
      return internalError(`${error}`)
    }
  }
}
