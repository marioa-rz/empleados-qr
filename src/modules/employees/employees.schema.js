import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    publicId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    photoUrl: { type: String, required: true, trim: true },
    status: { type: String, default: "Activo", trim: true },
  },
  { timestamps: true },
);

export default mongoose.model("Employee", EmployeeSchema);
