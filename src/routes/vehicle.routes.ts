import { Router } from "express";
import { VehicleRepository } from "../repositories/vehicle.repository";
import { VehicleService } from "../services/vehicle.service";
import { VehicleController } from "../controllers/vehicle.controller";

const router = Router();
const repository = new VehicleRepository();
const service = new VehicleService(repository);
const controller = new VehicleController(service);

router.post("/", controller.create);
router.get("/", controller.findAll);
router.get("/:id", controller.findById);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export { router as vehicleRouter };
