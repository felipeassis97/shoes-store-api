import express from "express";
import { config } from "dotenv";
import { SetupConnections } from "./core/providers/setup-connections";
import { CreateStoreController } from "./features/stores/controllers/create-store/create-store";
import { UpdateStoreController } from "./features/stores/controllers/update-store/update-users";
import { DeleteStoreController } from "./features/stores/controllers/delete-store/delete-user";
import { MongoBannersRepository } from "./features/banners/repositories/mongo-banners-repository";
import { GetStoresController } from "./features/stores/controllers/get-store/get-users";
import { CreateBannersController } from "./features/banners/controllers/create-banners/create-banners";
import { MongoStoresRepository } from "./features/stores/repositories/mongo-stores-repository";
import { GetBannersController } from "./features/banners/controllers/get-banners/get-banners";
import { UploadStoreLogo } from "./features/stores/controllers/upload-image/upload-store-logo";
import { FirebaseBucket } from "./core/providers/bucket/firebase-bucket";
import { UploadMultipleImages } from "./features/stores/controllers/upload-image/upload-multiple-images";
import { processMultiImageMiddleware, processSingleImageMiddleware } from "./core/middlewares/process-image-middleware";


const main = async () => {
  config();
  await SetupConnections.mongoDB();
  await SetupConnections.firebase();

  const app = express();
  app.use(express.json());

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

  app.post('/upload-multi', processMultiImageMiddleware, async (req, res) => {
    const bucket = new FirebaseBucket();
    const controller = new UploadMultipleImages(bucket);
    const { body, statusCode } = await controller.handle({ body: req.body, files: req.files as Express.Multer.File[] });
    res.status(statusCode).send(body);
  });

  app.post('/upload-single', processSingleImageMiddleware, async (req, res) => {
    const repository = new MongoStoresRepository();
    const controller = new UploadStoreLogo(repository);
    const { body, statusCode } = await controller.handle({ body: req.body, file: req.file });
    res.status(statusCode).send(body);
  });

  const port = process.env.PORT || 8000;

  app.listen(port, () => console.log(`Listening on port ${port}`));
};

main();
