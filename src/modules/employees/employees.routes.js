/**
 * Módulo de Rutas para la Gestión de Empleados (QR).
 * Define endpoints y enlaza con controladores.
 */
import { Router } from "express";
import {
  deleteEmpleado,
  getEmpleadoByPublicId,
  getEmpleados,
  postEmpleado,
  putEmpleado,
} from "./employees.controller.js";

// Si ya tenés validadores, aquí se importan como en tu ejemplo.
// import { ... } from "../../middlewares/empleados-validator.js";

const router = Router();

/**
 * @route GET /get
 * @description Obtiene todos los empleados.
 */
router.get("/get", getEmpleados);

/**
 * @route GET /get/:publicId
 * @description Obtiene un empleado por publicId (ej: EMP001).
 */
// router.get("/get/:publicId", getEmpleadoByPublicIdValidator, getEmpleadoByPublicId);
router.get("/get/:publicId", getEmpleadoByPublicId);

/**
 * @route POST /create
 * @description Crea un empleado.
 */
// router.post("/create", postEmpleadoValidator, postEmpleado);
router.post("/create", postEmpleado);

/**
 * @route PUT /update/:publicId
 * @description Actualiza un empleado por publicId.
 */
// router.put("/update/:publicId", putEmpleadoValidator, putEmpleado);
router.put("/update/:publicId", putEmpleado);

/**
 * @route DELETE /delete/:publicId
 * @description Elimina un empleado por publicId.
 */
// router.delete("/delete/:publicId", deleteEmpleadoValidator, deleteEmpleado);
router.delete("/delete/:publicId", deleteEmpleado);

export default router;
