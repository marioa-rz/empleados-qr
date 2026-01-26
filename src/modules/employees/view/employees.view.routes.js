import { Router } from "express";
import { viewEmpleadoCard } from "./employees.view.js";

const router = Router();

// Vista pública para QR
router.get("/:publicId", viewEmpleadoCard);

export default router;
