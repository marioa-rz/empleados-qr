/**
 * Módulo de Repositorio para la colección 'employees'.
 * Contiene funciones CRUD para interactuar con los datos de empleados.
 */
import Employee from "./employees.schema.js";

/**
 * @function findEmpleados
 * @description Obtiene todos los empleados.
 * @returns {Promise<Array<Object>>} Array con los empleados.
 */
export const findEmpleados = async () => {
  const rows = await Employee.find().lean();
  return rows;
};

/**
 * @function findEmpleadoByPublicId
 * @description Obtiene un empleado por su identificador público (publicId).
 * @param {String} publicId - ID público del empleado (ej: "EMP001").
 * @returns {Promise<Object | null>} Empleado o null.
 */
export const findEmpleadoByPublicId = async (publicId) => {
  const row = await Employee.findOne({ publicId }).lean();
  return row;
};

/**
 * @function createEmpleado
 * @description Crea un nuevo empleado.
 * @param {Object} data - Datos del empleado.
 * @returns {Promise<Object>} Empleado creado.
 */
export const createEmpleado = async (data) => {
  const row = await Employee.create(data);
  return row.toObject();
};

/**
 * @function updateEmpleadoByPublicId
 * @description Actualiza un empleado por publicId.
 * @param {String} publicId - ID público del empleado.
 * @param {Object} data - Campos a actualizar.
 * @returns {Promise<Object | null>} Empleado actualizado o null si no existe.
 */
export const updateEmpleadoByPublicId = async (publicId, data) => {
  const row = await Employee.findOneAndUpdate(
    { publicId },
    { $set: data },
    { new: true, runValidators: true },
  ).lean();

  return row;
};

/**
 * @function eliminateEmpleadoByPublicId
 * @description Elimina un empleado por publicId.
 * @param {String} publicId - ID público del empleado.
 * @returns {Promise<Number>} 1 si eliminó, 0 si no existía.
 */
export const eliminateEmpleadoByPublicId = async (publicId) => {
  const result = await Employee.deleteOne({ publicId });
  return result.deletedCount || 0;
};
