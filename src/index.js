import { config } from "dotenv";
import { initServer } from "./config/server.js";

config();
initServer();

console.log(
  "Aplicación iniciada. Esperando a que el servidor Express y la DB se conecten.",
);
