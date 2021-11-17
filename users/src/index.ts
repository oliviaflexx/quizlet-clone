import mongoose from "mongoose";
import {app} from "./app"
import { ClassCreatedListener } from "./events/listeners/class-created-listener";
import { ClassUpdatedListener } from "./events/listeners/class-updated-listener";
import { FolderCreatedListener } from "./events/listeners/folder-created-listener";
import { FolderUpdatedListener } from "./events/listeners/folder-updated-listener";
import { SetCreatedListener } from "./events/listeners/set-created-listener";
import { SetUpdatedListener } from "./events/listeners/set-updated-listener";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI must be defined");
    }

    if (!process.env.NATS_CLIENT_ID) {
      throw new Error("NATS_CLIENT_ID must be defined");
    }
    if (!process.env.NATS_URL) {
      throw new Error("NATS_URL must be defined");
    }
    if (!process.env.NATS_CLUSTER_ID) {
      throw new Error("NATS_CLUSTER_ID must be defined");
    }
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to MongoDb");

  new ClassCreatedListener(natsWrapper.client).listen();
  new ClassUpdatedListener(natsWrapper.client).listen();
  new FolderCreatedListener(natsWrapper.client).listen();
  new FolderUpdatedListener(natsWrapper.client).listen();
  new SetCreatedListener(natsWrapper.client).listen();
  new SetUpdatedListener(natsWrapper.client).listen();
  
  app.listen(3000, () => {
    console.log("Listening on port 3000!!!!!!!!");
  });
};

start();