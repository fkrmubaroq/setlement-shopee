import { Router } from "express";
import { upload } from "../../utils/uploader";
import * as dataShopeeController from "./data-shopee.controller";

const router: Router = Router();

router.get("/", dataShopeeController.getAllDataShopee);
router.get("/:id", dataShopeeController.getDataShopeeById);

router.post(
  "/",
  upload.fields([
    { name: "shopee_penghasilan_saya", maxCount: 1 },
    { name: "shopee_pesanan_saya", maxCount: 1 },
    { name: "shopee_biaya_iklan", maxCount: 1 },
  ]),
  dataShopeeController.createDataShopee,
);

router.put(
  "/:id",
  upload.fields([
    { name: "shopee_penghasilan_saya", maxCount: 1 },
    { name: "shopee_pesanan_saya", maxCount: 1 },
    { name: "shopee_biaya_iklan", maxCount: 1 },
  ]),
  dataShopeeController.updateDataShopee,
);

router.delete("/:id", dataShopeeController.deleteDataShopee);

export default router;
