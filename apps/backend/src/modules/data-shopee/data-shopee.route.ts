import { Router } from "express";
import { upload } from "../../utils/uploader";
import * as dataShopeeController from "./data-shopee.controller";

import { requireAuth, requireRole } from "../../middlewares/auth.middleware";

const router: Router = Router();

router.use(requireAuth);

router.get("/", dataShopeeController.getAllDataShopee);
router.get("/:id", dataShopeeController.getDataShopeeById);

router.post(
  "/",
  requireRole(["super_admin"]),
  upload.fields([
    { name: "shopee_penghasilan_saya", maxCount: 1 },
    { name: "shopee_pesanan_saya", maxCount: 1 },
    { name: "shopee_biaya_iklan", maxCount: 1 },
  ]),
  dataShopeeController.createDataShopee,
);

router.put(
  "/:id",
  requireRole(["super_admin"]),
  upload.fields([
    { name: "shopee_penghasilan_saya", maxCount: 1 },
    { name: "shopee_pesanan_saya", maxCount: 1 },
    { name: "shopee_biaya_iklan", maxCount: 1 },
  ]),
  dataShopeeController.updateDataShopee,
);

router.delete(
  "/:id",
  requireRole(["super_admin"]),
  dataShopeeController.deleteDataShopee,
);

export default router;
