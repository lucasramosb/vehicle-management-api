import { Router } from "express";
import { vehicleRouter } from "./vehicle.routes";
import { driverRouter } from "./driver.routes";
import { usageRouter } from "./usage.routes";

const router = Router();

router.use("/vehicles", vehicleRouter);
router.use("/drivers", driverRouter);
router.use("/usages", usageRouter);

export { router };
