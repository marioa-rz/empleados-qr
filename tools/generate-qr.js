import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.PUBLIC_BASE_URL;
if (!BASE_URL) throw new Error("PUBLIC_BASE_URL no está en .env");

// Carpeta de salida
const OUTPUT_DIR = path.join(__dirname, "qr");
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Modelo “rápido”
const EmployeeSchema = new mongoose.Schema(
  { publicId: String, status: String },
  { collection: "employees" },
);

const Employee =
  mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);

(async () => {
  try {
    if (!process.env.URI_MONGO) throw new Error("URI_MONGO no está en .env");

    await mongoose.connect(process.env.URI_MONGO);

    const employees = await Employee.find({ status: "Activo" })
      .select("publicId")
      .lean();

    if (!employees.length) {
      console.log("No hay empleados activos para generar QRs.");
      process.exit(0);
    }

    for (const emp of employees) {
      const id = String(emp.publicId || "").trim();
      if (!id) continue;

      const url = `${BASE_URL}/${id}`;
      const filePath = path.join(OUTPUT_DIR, `${id}.png`);

      await QRCode.toFile(filePath, url, {
        errorCorrectionLevel: "Q",
        width: 800,
        margin: 2,
      });

      console.log(`QR generado: ${filePath} -> ${url}`);
    }

    console.log("QRs generados desde MongoDB");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
})();
