import { CreateBrandRequestSchema, UpdateBrandRequestSchema } from "@setlement-shopee/types";
import { Router } from "express";
import { validateRequest } from "../../middlewares/validate-request";
import * as brandController from "./brand.controller";

const router: Router = Router();

router.get("/", brandController.getAllBrands);
router.get("/:id", brandController.getBrandById);

router.post(
  "/",
  validateRequest(CreateBrandRequestSchema),
  brandController.createBrand
);

router.put(
  "/:id",
  validateRequest(UpdateBrandRequestSchema),
  brandController.updateBrand
);

router.delete("/:id", brandController.deleteBrand);

export { router as brandRouter };
