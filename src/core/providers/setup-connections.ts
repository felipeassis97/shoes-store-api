import * as admin from "firebase-admin";
import { MongoClient as Mongo, Db } from "mongodb";

export const SetupConnections = {
  client: undefined as unknown as Mongo,
  db: undefined as unknown as Db,

  async mongoDB(): Promise<void> {
    const url = process.env.MONGODB_URL || "localhost:27017";
    const username = process.env.MONGODB_USERNAME;
    const password = process.env.MONGODB_PASSWORD;

    const client = new Mongo(url, { auth: { username, password } });
    const db = client.db(process.env.MONGODB_NAME);

    this.client = client;
    this.db = db;

    console.log("🚀 Connected to MongoDB!");
  },

  async firebase(): Promise<void> {
    const serviceAccount = require(process.env.FIREBASE_AUTH_PATH || "/");

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.BUCKET_URL
    });

    console.log("🚀 Connected to Firebase!");
  }
};
