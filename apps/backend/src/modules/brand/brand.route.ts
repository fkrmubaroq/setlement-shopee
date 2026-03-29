import {
  CreateBrandRequestSchema,
  UpdateBrandRequestSchema,
} from "@setlement-shopee/types";
import { Router } from "express";
import { validateRequest } from "../../middlewares/validate-request";
import * as brandController from "./brand.controller";

import { requireAuth, requireRole } from "../../middlewares/auth.middleware";

const router: Router = Router();

router.use(requireAuth);

router.get("/", brandController.getAllBrands);
router.get("/:id", brandController.getBrandById);

router.post(
  "/",
  requireRole(["super_admin"]),
  validateRequest(CreateBrandRequestSchema),
  brandController.createBrand,
);

router.put(
  "/:id",
  requireRole(["super_admin"]),
  validateRequest(UpdateBrandRequestSchema),
  brandController.updateBrand,
);

router.delete(
  "/:id",
  requireRole(["super_admin"]),
  brandController.deleteBrand,
);

export { router as brandRouter };
