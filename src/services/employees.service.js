import {
  createEmpleado,
  updateEmpleadoByPublicId,
} from "../modules/employees/employees.repository.js";
import {
  uploadPhotoFromUrl,
  uploadQrForPublicId,
} from "../modules/employees/employees.cloudinary.js";

const normalizeBaseUrl = (base) => String(base || "").replace(/\/+$/, "");

const required = (value, field) => {
  const v = String(value ?? "").trim();
  if (!v) throw new Error(`${field} es requerido`);
  return v;
};

export const createEmpleadoWithAssets = async (data) => {
  const BASE = normalizeBaseUrl(process.env.PUBLIC_BASE_URL);
  if (!BASE) throw new Error("PUBLIC_BASE_URL no está configurado");

  const publicId = required(data.publicId, "publicId");
  const photoUrlInput = required(data.photoUrl, "photoUrl");

  // 1) Subir FOTO (desde URL) a Cloudinary
  const photo = await uploadPhotoFromUrl(publicId, photoUrlInput);

  // 2) Crear empleado con foto estable
  const createdDoc = await createEmpleado({
    ...data,
    publicId,
    photoUrl: photo.photoUrl,
    photoPublicId: photo.photoPublicId,
  });

  // 3) URL pública del empleado (la vista)
  const employeeUrl = new URL(`/zoomsa/empleados/${publicId}`, BASE).toString();

  // 4) Generar + subir QR
  const qr = await uploadQrForPublicId(publicId, employeeUrl);

  // 5) Guardar QR en Mongo
  const updated = await updateEmpleadoByPublicId(publicId, {
    qrUrl: qr.qrUrl,
    qrPublicId: qr.qrPublicId,
  });

  // Fallback por si la actualización fallara (muy raro)
  if (!updated) {
    return {
      ...createdDoc.toObject(),
      qrUrl: qr.qrUrl,
      qrPublicId: qr.qrPublicId,
    };
  }

  return updated;
};
