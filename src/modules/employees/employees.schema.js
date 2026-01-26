import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    publicId: { type: String, required: true, unique: true, trim: true },

    name: { type: String, required: true, trim: true },
    surname: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },

    dpi: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{13}$/, "El DPI debe tener exactamente 13 dígitos"],
    },

    photoUrl: { type: String, required: true, trim: true },
    photoPublicId: { type: String, trim: true },

    qrUrl: { type: String, trim: true },
    qrPublicId: { type: String, trim: true },

    status: {
      type: String,
      enum: ["Activo", "Inactivo"],
      default: "Activo",
      trim: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Employee", EmployeeSchema);
