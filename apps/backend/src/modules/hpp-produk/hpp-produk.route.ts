import { CreateHppProdukBulkRequestSchema, CreateHppProdukRequestSchema, UpdateHppProdukRequestSchema } from "@setlement-shopee/types";
import { Router } from "express";
import { validateRequest } from "../../middlewares/validate-request";
import * as hppProdukController from "./hpp-produk.controller";

const router: Router = Router();

router.get("/", hppProdukController.getAllHppProduk);
router.get("/:id", hppProdukController.getHppProdukById);

router.post(
  "/",
  validateRequest(CreateHppProdukRequestSchema),
  hppProdukController.createHppProduk
);

router.post(
  "/bulk",
  validateRequest(CreateHppProdukBulkRequestSchema),
  hppProdukController.bulkCreateHppProduk
);

router.put(
  "/:id",
  validateRequest(UpdateHppProdukRequestSchema),
  hppProdukController.updateHppProduk
);

router.delete("/clear/:id_brand", hppProdukController.clearHppProdukByBrand);

router.delete("/:id_brand/:id", hppProdukController.deleteHppProduk);

export { router as hppProdukRouter };
