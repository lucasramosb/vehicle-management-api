import { Router } from "express";
import { DriverRepository } from "../repositories/driver.repository";
import { DriverService } from "../services/driver.service";
import { DriverController } from "../controllers/driver.controller";

const router = Router();
const repository = new DriverRepository();
const service = new DriverService(repository);
const controller = new DriverController(service);

router.post("/", controller.create);
router.get("/", controller.findAll);
router.get("/:id", controller.findById);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export { router as driverRouter };
