"use strict";
import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    if (!process.env.URI_MONGO) {
      throw new Error("URI_MONGO no está definida en el .env");
    }

    // Evita duplicar listeners si dbConnection se llama más de una vez
    mongoose.connection.removeAllListeners();

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB | error:", err.message);
    });

    mongoose.connection.on("connecting", () => {
      console.log("MongoDB | intentando conectar...");
    });

    mongoose.connection.on("connected", () => {
      console.log("MongoDB | conectado");
    });

    mongoose.connection.on("open", () => {
      console.log("MongoDB | conexión abierta a la base de datos");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB | reconectado");
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB | desconectado");
    });

    await mongoose.connect(process.env.URI_MONGO, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 50,
    });

    return true;
  } catch (e) {
    console.error("Conexión a base de datos fallida:", e.message);
    throw e; // IMPORTANTE: para que tu server sí caiga si no conecta
  }
};
