import { Router } from "express";
import { viewEmpleadoCard } from "./employees.view.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("VIEW OK");
});

// Vista pública para QR
router.get("/:publicId", viewEmpleadoCard);

export default router;
