import QRCode from "qrcode";
import cloudinary from "../config/cloudinary.js";

export const generateAndUploadQr = async ({ publicId, url }) => {
  // 1. Generar QR en memoria
  const buffer = await QRCode.toBuffer(url, {
    errorCorrectionLevel: "Q",
    width: 900,
    margin: 2,
  });

  // 2. Convertir a Data URI
  const base64 = buffer.toString("base64");
  const dataUri = `data:image/png;base64,${base64}`;

  // 3. Subir a Cloudinary
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "empleados/qrs",
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
  });

  return {
    qrUrl: result.secure_url,
    qrPublicId: result.public_id,
  };
};
