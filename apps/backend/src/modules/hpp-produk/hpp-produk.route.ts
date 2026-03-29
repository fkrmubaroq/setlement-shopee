import {
  CreateHppProdukBulkRequestSchema,
  CreateHppProdukRequestSchema,
  UpdateHppProdukRequestSchema,
} from "@setlement-shopee/types";
import { Router } from "express";
import { validateRequest } from "../../middlewares/validate-request";
import * as hppProdukController from "./hpp-produk.controller";

import { requireAuth, requireRole } from "../../middlewares/auth.middleware";

const router: Router = Router();

router.use(requireAuth);

router.get("/", hppProdukController.getAllHppProduk);
router.get("/:id", hppProdukController.getHppProdukById);

router.post(
  "/",
  requireRole(["super_admin"]),
  validateRequest(CreateHppProdukRequestSchema),
  hppProdukController.createHppProduk,
);

router.post(
  "/bulk",
  requireRole(["super_admin"]),
  validateRequest(CreateHppProdukBulkRequestSchema),
  hppProdukController.bulkCreateHppProduk,
);

router.put(
  "/:id",
  requireRole(["super_admin"]),
  validateRequest(UpdateHppProdukRequestSchema),
  hppProdukController.updateHppProduk,
);

router.delete(
  "/clear/:id_brand",
  requireRole(["super_admin"]),
  hppProdukController.clearHppProdukByBrand,
);

router.delete(
  "/:id_brand/:id",
  requireRole(["super_admin"]),
  hppProdukController.deleteHppProduk,
);

export { router as hppProdukRouter };
