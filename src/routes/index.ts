import { Router } from "express";
import { vehicleRouter } from "./vehicle.routes";
import { driverRouter } from "./driver.routes";

const router = Router();

router.use("/vehicles", vehicleRouter);
router.use("/drivers", driverRouter);

export { router };
