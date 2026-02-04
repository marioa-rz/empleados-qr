import cloudinary from "../../config/cloudinary.js";
import QRCode from "qrcode";

const FOLDER_FOTOS = "empleados/fotos";
const FOLDER_QRS = "empleados/qrs";

export const uploadPhotoFromUrl = async (publicId, photoUrl) => {
  const result = await cloudinary.uploader.upload(photoUrl, {
    folder: FOLDER_FOTOS,
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
  });

  return {
    photoUrl: result.secure_url,
    photoPublicId: result.public_id, // empleados/fotos/<publicId>
  };
};

  export const uploadQrForPublicId = async (publicId, url) => {
  const buffer = await QRCode.toBuffer(url, {
    errorCorrectionLevel: "Q",
    width: 900,
    margin: 2,
    color: {
      dark: "#1F386C", // color del QR
      light: "#ffffff", // fondo
    },
  });

  const dataUri = `data:image/png;base64,${buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: FOLDER_QRS,
    public_id: publicId,
    overwrite: true,
    invalidate: true,
    resource_type: "image",
  });

  return {
    qrUrl: result.secure_url,
    qrPublicId: result.public_id, // empleados/qrs/<publicId>
  };
};
