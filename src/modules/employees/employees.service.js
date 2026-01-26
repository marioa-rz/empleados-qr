import {
  createEmpleado,
  updateEmpleadoByPublicId,
} from "./employees.repository.js";
import {
  uploadPhotoFromUrl,
  uploadQrForPublicId,
} from "./employees.cloudinary.js";

const normalizeBaseUrl = (base) => String(base || "").replace(/\/+$/, "");

export const createEmpleadoWithAssets = async (data) => {
  const BASE = normalizeBaseUrl(process.env.PUBLIC_BASE_URL);
  if (!BASE) throw new Error("PUBLIC_BASE_URL no está configurado");

  const publicId = String(data.publicId || "").trim();
  if (!publicId) throw new Error("publicId es requerido");

  const photoUrlInput = String(data.photoUrl || "").trim();
  if (!photoUrlInput) throw new Error("photoUrl es requerido");

  // 1) Copiar FOTO a Cloudinary (desde URL)
  const photo = await uploadPhotoFromUrl(publicId, photoUrlInput);

  // 2) Crear empleado en Mongo con la foto ya “estable”
  const created = await createEmpleado({
    ...data,
    photoUrl: photo.photoUrl,
    photoPublicId: photo.photoPublicId,
  });

  // 3) Generar QR con la URL pública del empleado
  const employeeUrl = `${BASE}/${publicId}`;

  // 4) Subir QR a Cloudinary
  const qr = await uploadQrForPublicId(publicId, employeeUrl);

  // 5) Guardar qrUrl/qrPublicId en Mongo
  const updated = await updateEmpleadoByPublicId(publicId, {
    qrUrl: qr.qrUrl,
    qrPublicId: qr.qrPublicId,
  });

  return updated || { ...created, ...qr };
};
