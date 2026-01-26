import Employee from "./employees.schema.js";

export const findEmpleados = async () => {
  const rows = await Employee.find().lean();
  return rows;
};

export const findEmpleadoByPublicId = async (publicId) => {
  const row = await Employee.findOne({ publicId }).lean();
  return row;
};

export const createEmpleado = async (data) => {
  const row = await Employee.create(data);
  return row.toObject();
};

export const updateEmpleadoByPublicId = async (publicId, data) => {
  const row = await Employee.findOneAndUpdate(
    { publicId },
    { $set: data },
    { new: true, runValidators: true },
  ).lean();

  return row;
};

export const eliminateEmpleadoByPublicId = async (publicId) => {
  const result = await Employee.deleteOne({ publicId });
  return result.deletedCount || 0;
};
