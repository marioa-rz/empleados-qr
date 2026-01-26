import cloudinary from "../../config/cloudinary.js";
import QRCode from "qrcode";

const FOLDER_FOTOS = "empleados/fotos";
const FOLDER_QRS = "empleados/qrs";

export const uploadPhotoFromUrl = async (publicId, photoUrl) => {
  const result = await cloudinary.uploader.upload(photoUrl, {
    folder: FOLDER_FOTOS,
    public_id: publicId, // queda como empleados/fotos/<publicId>
    overwrite: true,
    resource_type: "image",
  });

  return {
    photoUrl: result.secure_url,
    photoPublicId: result.public_id,
  };
};

export const uploadQrForPublicId = async (publicId, url) => {
  const buffer = await QRCode.toBuffer(url, {
    errorCorrectionLevel: "Q",
    width: 800,
    margin: 2,
  });

  const b64 = buffer.toString("base64");
  const dataUri = `data:image/png;base64,${b64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: FOLDER_QRS,
    public_id: publicId, // queda como empleados/qrs/<publicId>
    overwrite: true,
    resource_type: "image",
  });

  return {
    qrUrl: result.secure_url,
    qrPublicId: result.public_id,
  };
};
