import {
  createEmpleado,
  updateEmpleadoByPublicId,
} from "../modules/employees/employees.repository.js";

import {
  uploadPhotoFromUrl,
  uploadQrForPublicId,
} from "../modules/employees/employees.cloudinary.js";

const normalizeBaseUrl = (base) => {
  let b = String(base || "").trim();

  // quita / al final
  b = b.replace(/\/+$/, "");

  // si ya trae /emp se remueve
  b = b.replace(/\/emp\/?$/i, "");

  return b;
};

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

  // 3) URL pública del empleado (la vista) - SIEMPRE queda bien
  const employeeUrl = new URL(`/emp/${publicId}`, BASE).toString();

  // 4) Generar + subir QR
  const qr = await uploadQrForPublicId(publicId, employeeUrl);

  // 5) Guardar QR en Mongo
  const updated = await updateEmpleadoByPublicId(publicId, {
    qrUrl: qr.qrUrl,
    qrPublicId: qr.qrPublicId,
  });

  if (!updated) {
    return {
      ...createdDoc.toObject(),
      qrUrl: qr.qrUrl,
      qrPublicId: qr.qrPublicId,
    };
  }

  return updated;
};
