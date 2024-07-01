import { IController } from "../../../../core/protocols/protocols";
import { IStoresRepository } from "../../repositories/i-stores-repository";

export class GetStoresController implements IController {
  constructor(private readonly getUserRepository: IStoresRepository) { }

  async handle() {
    try {
      const users = await this.getUserRepository.getStores();
      return {
        statusCode: 200,
        body: users,
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: `${error}`,
      };
    }
  }
}
