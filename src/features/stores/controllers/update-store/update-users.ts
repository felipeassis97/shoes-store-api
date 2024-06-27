import { Store } from "../../models/store";
import { IStoresRepository } from "../../repositories/i-stores-repository";
import { UpdateAddressParams, UpdateStoreParams } from "./update-store-params";
import { badRequest, internalError, ok } from "../../../../core/helpers/helpers";
import { HttpRequest, HttpResponse, IController } from "../../../../core/protocols/protocols";


export class UpdateStoreController implements IController {
  constructor(private readonly updateUserRepository: IStoresRepository) { }
  async handle(httpRequest: HttpRequest<UpdateStoreParams>): Promise<HttpResponse<Store>> {
    const id = httpRequest?.params?.id;
    const body = httpRequest?.body;
    try {
      if (!body) {
        return badRequest("Error: Body missing fields.");
      }
      if (!id) {
        return badRequest("Error: Missing user id.");
      }
      const allowedFieldsToUpdate = ["name", "description", "logo"];
      const addressAllowedFieldsToUpdate = ["street", "neighborhood", "city", "country", "zipcode", "lat", "lng"];

      const someFieldNotAllowedToUpdate = Object.keys(body).some(
        (key) => !allowedFieldsToUpdate.includes(key as keyof UpdateStoreParams)
      );

      const someFieldAddressNotAllowedToUpdate = Object.keys(body).some(
        (key) => !addressAllowedFieldsToUpdate.includes(key as keyof UpdateAddressParams)
      );

      if (someFieldNotAllowedToUpdate || someFieldAddressNotAllowedToUpdate) {
        return badRequest("Error: Some received field is not allowed.");
      }

      const user = await this.updateUserRepository.updateStore(id, body);

      return ok(user);
    } catch (error) {
      return internalError(`${error}`);
    }
  }
}
