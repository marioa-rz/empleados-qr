import Employee from "./employees.schema.js";

export const findEmpleados = async () => Employee.find().lean();

export const findEmpleadoByPublicId = async (publicId) =>
  Employee.findOne({ publicId }).lean();

export const createEmpleado = async (data) => {
  // Devuelve documento (no lean) para poder hacer save si hace falta
  const doc = await Employee.create(data);
  return doc;
};

export const updateEmpleadoByPublicId = async (publicId, data) =>
  Employee.findOneAndUpdate(
    { publicId },
    { $set: data },
    { new: true, runValidators: true },
  ).lean();

export const eliminateEmpleadoByPublicId = async (publicId) => {
  const result = await Employee.deleteOne({ publicId });
  return result.deletedCount || 0;
};
