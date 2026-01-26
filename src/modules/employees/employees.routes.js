import { Router } from "express";
import {
  deleteEmpleado,
  getEmpleadoByPublicId,
  getEmpleados,
  postEmpleado,
  putEmpleado,
} from "./employees.controller.js";

const router = Router();


router.get("/get", getEmpleados);

router.get("/get/:publicId", getEmpleadoByPublicId);

router.post("/create", postEmpleado);

router.put("/update/:publicId", putEmpleado);

router.delete("/delete/:publicId", deleteEmpleado);

export default router;
