import express from "express";
import cors from "cors";
import morgan from "morgan";

import { dbConnection } from "./mongo.js";

// Importación de Módulos de Rutas
import employeesRoutes from "../modules/employees/employees.routes.js";
import employeesView from "../modules/employees/view/employees.view.routes.js";

const middlewares = (app) => {
  app.use(express.json());
  app.use(cors());
  app.use(morgan("dev"));
};

const routes = (app) => {
  // Monta las rutas del módulo employees
  app.use("/zoomsa/v1/empleados", employeesRoutes);
  app.use("/zoomsa/empleados", employeesView);
};

const notFound = (req, res) => {
  const wantsHtml = req.headers.accept?.includes("text/html");

  if (wantsHtml) {
    return res.status(404).send(`
      <!doctype html>
      <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>404</title>
      </head>
      <body style="font-family:system-ui; padding:24px;">
        <h2>Ruta no encontrada</h2>
        <p>${req.originalUrl}</p>
      </body>
      </html>
    `);
  }

  return res.status(404).json({
    msg: "Ruta no encontrada",
    path: req.originalUrl,
  });
};

const connectToDatabase = async () => {
  try {
    await dbConnection();
  } catch (err) {
    console.error("Error con la conexión a MongoDB:", err);
    process.exit(1);
  }
};

export const initServer = async () => {
  const app = express();

  try {
    // 1. Conexión a la Base de Datos
    await connectToDatabase();
    console.log("Conexión a MongoDB establecida con éxito.");

    // 2. Configuración de Middlewares
    middlewares(app);

    // Ruta de Salud del Servicio, activa el servidor
    app.get("/health", (req, res) => {
      res.status(200).json({
        ok: true,
        service: "zoomsa-backend",
        time: new Date().toISOString(),
      });
    });

    // 3. Definición de Rutas
    routes(app);

    // 4. Manejo de Rutas No Encontradas (404)
    app.use(notFound);

    // 5. Arranque del Servidor
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en el puerto: ${PORT}`);
    });
  } catch (err) {
    console.error("Error al inicializar el servidor: ", err);
    process.exit(1);
  }
};
