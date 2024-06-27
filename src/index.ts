import express from "express";
import { config } from "dotenv";
import { MongoClient } from "./core/database/mongo";
import { CreateStoreController } from "./features/stores/controllers/create-store/create-store";
import { UpdateStoreController } from "./features/stores/controllers/update-store/update-users";
import { DeleteStoreController } from "./features/stores/controllers/delete-store/delete-user";
import { MongoBannersRepository } from "./features/banners/repositories/mongo-banners-repository";
import { GetStoresController } from "./features/stores/controllers/get-store/get-users";
import { CreateBannersController } from "./features/banners/controllers/create-banners/create-banners";
import { MongoStoresRepository } from "./features/stores/repositories/mongo-stores-repository";
import { GetBannersController } from "./features/banners/controllers/get-banners/get-banners";

const main = async () => {
  config();
  const app = express();
  app.use(express.json());
  await MongoClient.connect();

  //User
  app.get("/stores", async (_, res) => {
    const repository = new MongoStoresRepository();
    const controller = new GetStoresController(repository);
    const { body, statusCode } = await controller.handle();
    res.status(statusCode).send(body);
  });

  app.post("/store", async (req, res) => {
    const repository = new MongoStoresRepository();
    const controller = new CreateStoreController(repository);
    const { body, statusCode } = await controller.handle({ body: req.body });
    res.status(statusCode).send(body);
  });

  app.patch("/store/:id", async (req, res) => {
    const repository = new MongoStoresRepository();
    const controller = new UpdateStoreController(repository);
    const { body, statusCode } = await controller.handle({
      body: req.body,
      params: req.params,
    });
    res.status(statusCode).send(body);
  });

  app.delete("/store/:id", async (req, res) => {
    const repository = new MongoStoresRepository();
    const controller = new DeleteStoreController(repository);
    const { body, statusCode } = await controller.handle({
      params: req.params,
    });
    res.status(statusCode).send(body);
  });

  // Banner
  app.get("/banners", async (req, res) => {
    const repository = new MongoBannersRepository();
    const controller = new GetBannersController(repository);
    const { body, statusCode } = await controller.handle();
    res.status(statusCode).send(body);
  });

  app.post("/banners", async (req, res) => {
    const repository = new MongoBannersRepository();
    const controller = new CreateBannersController(repository);
    const { body, statusCode } = await controller.handle({ body: req.body });
    res.status(statusCode).send(body);
  });

  const port = process.env.PORT || 8000;

  app.listen(port, () => console.log(`Listening on port ${port}`));
};

main();
