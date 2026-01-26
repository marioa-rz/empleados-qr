import cloudinary from "../config/cloudinary.js";
import QRCode from "qrcode";

const uploadQr = async (publicId, url) => {
  const buffer = await QRCode.toBuffer(url, {
    errorCorrectionLevel: "Q",
    width: 800,
    margin: 2,
  });
  const b64 = buffer.toString("base64");
  const dataUri = `data:image/png;base64,${b64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "empleados-qr",
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
  });

  return result.secure_url;
};
