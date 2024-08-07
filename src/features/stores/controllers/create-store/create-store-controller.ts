import { Store } from "../../models/store";
import { AddressParams, CreateStoresParams } from "./create-store-params";
import { IStoresRepository } from "../../repositories/i-stores-repository";
import { badRequest, created, internalError } from "../../../../core/helpers/helpers";
import { HttpRequest, HttpResponse, IController } from "../../../../core/protocols/protocols";

export class CreateStoreController implements IController {
  constructor(private readonly storeRepository: IStoresRepository) { }

  async handle(
    httpRequest: HttpRequest<CreateStoresParams>
  ): Promise<HttpResponse<Store | string>> {
    try {
      const requiredFields = ["name", "description"];
      const addressFields = ["street", "neighborhood", "city", "country", "zipcode", "lat", "lng"];

      // Validate body
      if (!httpRequest.body) {
        return badRequest("Error: Body missing fields.");
      }

      // Validate store required fields
      for (const field of requiredFields) {
        const value = httpRequest?.body?.[field as keyof CreateStoresParams];
        if (typeof value !== 'string' || !value.length) {
          return badRequest(`Error: Field ${field} is required`);
        }
      }

      // Validate address required fields
      const address = httpRequest.body.address;
      if (!address) {
        return badRequest("Error: Address is required");
      }
      for (const field of addressFields) {
        const value = address[field as keyof AddressParams];
        if (typeof value !== 'string' || !value.length) {
          return badRequest(`Error: Field ${field} in address is required`);
        }
      }
      const store = await this.storeRepository
        .createStore(
          httpRequest.body
        );
      return created(store);
    } catch (error) {
      return internalError(`${error}`);
    }
  }
}
