import {
  createEmpleado,
  eliminateEmpleadoByPublicId,
  findEmpleadoByPublicId,
  findEmpleados,
  updateEmpleadoByPublicId,
} from "./employees.model.js";

export const getEmpleados = async (req, res) => {
  try {
    const result = await findEmpleados();
    res.json({ result });
  } catch (err) {
    res.status(500).json({
      msg: "Error al obtener empleados",
      error: err,
    });
  }
};

export const getEmpleadoByPublicId = async (req, res) => {
  try {
    const { publicId } = req.params;
    const result = await findEmpleadoByPublicId(publicId);

    if (!result) {
      return res.status(404).json({ msg: "Empleado no encontrado" });
    }

    res.json({ result });
  } catch (err) {
    res.status(500).json({
      msg: "Error al obtener empleado",
      error: err,
    });
  }
};

export const postEmpleado = async (req, res) => {
  try {
    const newEmpleado = await createEmpleado(req.body);
    res.status(201).json(newEmpleado);
  } catch (err) {
    res.status(500).json({
      msg: "Error al crear empleado",
      error: err,
    });
  }
};

export const putEmpleado = async (req, res) => {
  try {
    const { publicId } = req.params;

    const updated = await updateEmpleadoByPublicId(publicId, req.body);

    if (!updated) {
      return res.status(404).json({ msg: "Empleado no encontrado" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({
      msg: "Error al actualizar empleado",
      error: err,
    });
  }
};

export const deleteEmpleado = async (req, res) => {
  try {
    const { publicId } = req.params;
    const deleted = await eliminateEmpleadoByPublicId(publicId);

    if (!deleted) {
      return res.status(404).json({ msg: "Empleado no encontrado" });
    }

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      msg: "Error al borrar empleado",
      error: err,
    });
  }
};
