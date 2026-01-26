import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// --- FIX para __dirname en ESM ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ⚠️ ESTA URL DEBE SER FINAL Y ESTABLE
const BASE_URL = "http://localhost:3001/zoomsa/v1/empleados/get";
// 👉 luego cambias a dominio real en producción

// Carpeta de salida
const OUTPUT_DIR = path.join(__dirname, "qr");

// IDs de empleados (los mismos que guardas en Mongo)
const EMPLOYEES = [
  "EMP001",
  "EMP002",
  "EMP003",
  // ...
];

// Crear carpeta si no existe
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

(async () => {
  try {
    for (const id of EMPLOYEES) {
      const url = `${BASE_URL}/${id}`;
      const filePath = path.join(OUTPUT_DIR, `${id}.png`);

      await QRCode.toFile(filePath, url, {
        errorCorrectionLevel: "Q", // Alta tolerancia a daño
        width: 800,
        margin: 2,
      });

      console.log(`QR generado: ${filePath}`);
    }

    console.log("Todos los QRs fueron generados");
  } catch (err) {
    console.error("Error generando QRs:", err);
  }
})();
