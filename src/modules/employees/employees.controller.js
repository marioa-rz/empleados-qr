import {
  eliminateEmpleadoByPublicId,
  findEmpleadoByPublicId,
  findEmpleados,
  updateEmpleadoByPublicId,
} from "./employees.repository.js";

import { createEmpleadoWithAssets } from "./employees.service.js";

// helper para errores “pulidos”
const sendError = (res, err, defaultMsg) => {
  if (err?.name === "ValidationError") {
    return res.status(400).json({ msg: err.message });
  }
  if (err?.code === 11000) {
    return res
      .status(409)
      .json({ msg: "Duplicado: publicId ya existe", detail: err.keyValue });
  }
  return res
    .status(500)
    .json({ msg: defaultMsg, error: err?.message || String(err) });
};

export const getEmpleados = async (req, res) => {
  try {
    const result = await findEmpleados();
    res.json({ result });
  } catch (err) {
    sendError(res, err, "Error al obtener empleados");
  }
};

export const getEmpleadoByPublicId = async (req, res) => {
  try {
    const { publicId } = req.params;
    const result = await findEmpleadoByPublicId(publicId);

    if (!result) return res.status(404).json({ msg: "Empleado no encontrado" });
    res.json({ result });
  } catch (err) {
    sendError(res, err, "Error al obtener empleado");
  }
};

export const postEmpleado = async (req, res) => {
  try {
    const created = await createEmpleadoWithAssets(req.body);
    return res.status(201).json(created);
  } catch (err) {
    // Si faltan campos, devolvemos 400 (no es server error)
    const msg = err?.message || "";
    if (msg.includes("requerido") || msg.includes("configurado")) {
      return res.status(400).json({ msg });
    }
    return sendError(res, err, "Error al crear empleado");
  }
};

export const putEmpleado = async (req, res) => {
  try {
    const { publicId } = req.params;

    const updated = await updateEmpleadoByPublicId(publicId, req.body);
    if (!updated)
      return res.status(404).json({ msg: "Empleado no encontrado" });

    res.json(updated);
  } catch (err) {
    sendError(res, err, "Error al actualizar empleado");
  }
};

export const deleteEmpleado = async (req, res) => {
  try {
    const { publicId } = req.params;
    const deleted = await eliminateEmpleadoByPublicId(publicId);

    if (!deleted)
      return res.status(404).json({ msg: "Empleado no encontrado" });
    res.sendStatus(204);
  } catch (err) {
    sendError(res, err, "Error al borrar empleado");
  }
};
