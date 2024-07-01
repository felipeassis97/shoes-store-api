import express from "express";
import { config } from "dotenv";
import { SetupConnections } from "./core/providers/setup-connections";
import { CreateStoreController } from "./features/stores/controllers/create-store/create-store-controller";
import { UpdateStoreController } from "./features/stores/controllers/update-store/update-store-controller";
import { DeleteStoreController } from "./features/stores/controllers/delete-store/delete-store-controller";
import { MongoBannersRepository } from "./features/banners/repositories/mongo-banners-repository";
import { GetStoresController } from "./features/stores/controllers/get-stores/get-stores-controller";
import { CreateBannersController } from "./features/banners/controllers/create-banners/create-banners-controller";
import { MongoStoresRepository } from "./features/stores/repositories/mongo-stores-repository";
import { GetBannersController } from "./features/banners/controllers/get-banners/get-banners-controller";
import { UploadStoreLogoController } from "./features/stores/controllers/upload-image/upload-store-logo-controller";
import { FirebaseBucket } from "./core/providers/bucket/firebase-bucket";
import { UploadMultipleImages } from "./features/stores/controllers/upload-image/upload-multiple-images";
import { processMultiImageMiddleware, processSingleImageMiddleware } from "./core/middlewares/process-image-middleware";
import { MongoBrandsRepository } from "./features/brands/repositories/mongo-brands-repository";
import { CreateBrandController } from "./features/brands/controllers/create-brand/create-brand-controller";
import { GetBrandsController } from "./features/brands/controllers/get-brands/get-brands-controller";
import { DeleteBrandController } from "./features/brands/controllers/delete-brand/delete-brand-controller";
import { GetStoreController } from "./features/stores/controllers/get-stores/get-store-controller";
import { GetBrandController } from "./features/brands/controllers/get-brands/get-brand-controller";
import { MongoProductsRepository } from "./features/products/repositories/mongo-products-repository";
import { CreateProductController } from "./features/products/controllers/create-product/create-product-controller";
import { DeleteProductController } from "./features/products/controllers/delete-product/delete-product";


const main = async () => {
  config();
  await SetupConnections.mongoDB();
  await SetupConnections.firebase();

  const app = express();
  app.use(express.json());

  //stores
  app.get("/stores", async (_, res) => {
    const bucket = new FirebaseBucket()
    const repository = new MongoStoresRepository(bucket);
    const controller = new GetStoresController(repository);
    const { body, statusCode } = await controller.handle();
    res.status(statusCode).send(body);
  });

  app.post("/store", async (req, res) => {
    const bucket = new FirebaseBucket()
    const repository = new MongoStoresRepository(bucket);
    const controller = new CreateStoreController(repository);
    const { body, statusCode } = await controller.handle({ body: req.body });
    res.status(statusCode).send(body);
  });

  app.patch("/store/:id", async (req, res) => {
    const bucket = new FirebaseBucket()
    const repository = new MongoStoresRepository(bucket);
    const controller = new UpdateStoreController(repository);
    const { body, statusCode } = await controller.handle({
      body: req.body,
      params: req.params,
    });
    res.status(statusCode).send(body);
  });

  app.delete("/store/:id", async (req, res) => {
    const bucket = new FirebaseBucket()
    const repository = new MongoStoresRepository(bucket);
    const controller = new DeleteStoreController(repository);
    const { body, statusCode } = await controller.handle({
      params: req.params,
    });
    res.status(statusCode).send(body);
  });

  app.get("/store/:id", async (req, res) => {
    const bucket = new FirebaseBucket()
    const repository = new MongoStoresRepository(bucket);
    const controller = new GetStoreController(repository);
    const { body, statusCode } = await controller.handle({
      params: req.params,
    });
    res.status(statusCode).send(body);
  });

  // Banner
  app.get("/banners", async (req, res) => {
    const bucket = new FirebaseBucket()
    const repository = new MongoBannersRepository(bucket);
    const controller = new GetBannersController(repository);
    const { body, statusCode } = await controller.handle();
    res.status(statusCode).send(body);
  });

  app.post("/banners", processMultiImageMiddleware, async (req, res) => {
    const bucket = new FirebaseBucket()
    const repository = new MongoBannersRepository(bucket);
    const controller = new CreateBannersController(repository);
    const { body, statusCode } = await controller.handle({ files: req.files });
    res.status(statusCode).send(body);
  });

  app.post('/upload-multi', processMultiImageMiddleware, async (req, res) => {
    const bucket = new FirebaseBucket();
    const controller = new UploadMultipleImages(bucket);
    const { body, statusCode } = await controller.handle({ body: req.body, files: req.files as Express.Multer.File[] });
    res.status(statusCode).send(body);
  });

  app.post('/store-logo', processSingleImageMiddleware, async (req, res) => {
    const bucket = new FirebaseBucket()
    const repository = new MongoStoresRepository(bucket);
    const controller = new UploadStoreLogoController(repository);
    const { body, statusCode } = await controller.handle({ body: req.body, file: req.file });
    res.status(statusCode).send(body);
  });


  app.post('/create-brand', processSingleImageMiddleware, async (req, res) => {
    const bucket = new FirebaseBucket();
    const repository = new MongoBrandsRepository(bucket);
    const controller = new CreateBrandController(repository);
    const { body, statusCode } = await controller.handle({ body: req.body, file: req.file });
    res.status(statusCode).send(body);
  });

  app.get('/brands', async (_, res) => {
    const bucket = new FirebaseBucket();
    const repository = new MongoBrandsRepository(bucket);
    const controller = new GetBrandsController(repository);
    const { body, statusCode } = await controller.handle();
    res.status(statusCode).send(body);
  });

  app.get("/brand/:id", async (req, res) => {
    const bucket = new FirebaseBucket();
    const repository = new MongoBrandsRepository(bucket);
    const controller = new GetBrandController(repository);
    const { body, statusCode } = await controller.handle({
      params: req.params,
    });
    res.status(statusCode).send(body);
  });

  app.delete("/brand/:id", async (req, res) => {
    const bucket = new FirebaseBucket();
    const repository = new MongoBrandsRepository(bucket);
    const controller = new DeleteBrandController(repository);
    const { body, statusCode } = await controller.handle({
      params: req.params,
    });
    res.status(statusCode).send(body);
  });

  //Product
  app.post('/create-product', processMultiImageMiddleware, async (req, res) => {
    const bucket = new FirebaseBucket();
    const repository = new MongoProductsRepository(bucket);
    const controller = new CreateProductController(repository);
    const { body, statusCode } = await controller.handle({ body: req.body, files: req.files });
    res.status(statusCode).send(body);
  });

  app.delete("/product/:id", async (req, res) => {
    const bucket = new FirebaseBucket();
    const repository = new MongoProductsRepository(bucket);
    const controller = new DeleteProductController(repository);
    const { body, statusCode } = await controller.handle({
      params: req.params,
    });
    res.status(statusCode).send(body);
  });

  const port = process.env.PORT || 8000;

  app.listen(port, () => console.log(`Listening on port ${port}`));
};

main();
