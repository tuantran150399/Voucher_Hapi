import * as Hapi from "@hapi/hapi";
import { Server, Request, ResponseToolkit } from "@hapi/hapi";
import { run } from "./mongoDB/mongoconnect";
import { userRoutes } from "./routes/userRoute";
import { eventRoutes } from "./routes/eventRoute";
import { voucherRoutes } from "./routes/vouRoute";
import * as HapiSwagger from "hapi-swagger";
import Vision from "@hapi/vision";
import Inert from "@hapi/inert";
import * as jwt from "hapi-auth-jwt2";
import { authRoutes } from "./routes/authRoute";
require("dotenv").config();
const server: Server = new Server({
  port: process.env.PORT,
  host: process.env.DB_HOST,
});

export const start = async () => {
  const swaggerOptions: HapiSwagger.RegisterOptions = {
    info: {
      title: "API Documentation for Voucher-Application",
      version: "v1.0.0",
      contact: {
        name: "anh tuan",
        email: "anhtuan3683242@gmail.com",
      },
    },
  };
  await server.register(jwt);
  server.auth.strategy("jwt", "jwt", {
    key: "secret", // Never Share your secret key
    validate: (decoded, request) => true, // validate function defined above,
    verifyOptions: { algorithms: ["HS256"] },
  });

  const plugins: Array<Hapi.ServerRegisterPluginObject<any>> = [
    {
      plugin: Inert,
    },
    {
      plugin: Vision,
    },
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ];

  await server.register(plugins);

  try {
    await server.start();
    console.log(`Listening on ${server.settings.host}:${server.settings.port}`);
  } catch (err) {
    console.log(err);
  }
  process.on("unhandledRejection", (err) => {
    console.error("unhandledRejection");
    console.error(err);
    process.exit(1);
  });
};
run();
//register router
userRoutes(server);
eventRoutes(server);
voucherRoutes(server);
authRoutes(server);
function index(req: Request, res: ResponseToolkit): string {
  console.log("Processing request", req.info.id);
  return "done";
}
server.route({
  method: "GET",
  path: "/",
  handler: (request, h) => {
    index;
    return "Hello World!";
  },
});

export const init = async () => {

  await server.initialize();
  return server;
};
