import { Router } from "express";
import { UsageRepository } from "../repositories/usage.repository";
import { VehicleRepository } from "../repositories/vehicle.repository";
import { DriverRepository } from "../repositories/driver.repository";
import { UsageService } from "../services/usage.service";
import { UsageController } from "../controllers/usage.controller";

const router = Router();
const usageRepository = new UsageRepository();
const vehicleRepository = new VehicleRepository();
const driverRepository = new DriverRepository();
const service = new UsageService(
  usageRepository,
  vehicleRepository,
  driverRepository,
);
const controller = new UsageController(service);

router.post("/", controller.create);
router.get("/", controller.findAll);
router.patch("/:id/finish", controller.finish);

export { router as usageRouter };
