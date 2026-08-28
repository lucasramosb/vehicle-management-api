import { RequestHandler } from "express";
import { VehicleService } from "../services/vehicle.service";
import {
  createVehicleSchema,
  updateVehicleSchema,
} from "../schemas/vehicle.schema";
import { AppError } from "../errors/AppError";
import { Vehicle } from "../models/vehicle.model";

type IdParam = { id: string };
type VehicleFilterQuery = { color?: string; brand?: string };

export class VehicleController {
  constructor(private service: VehicleService) {}

  create: RequestHandler<
    {},
    Vehicle,
    { plate: string; color: string; brand: string }
  > = (req, res, next) => {
    try {
      const parsed = createVehicleSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(parsed.error.issues[0].message, 400);
      }
      const vehicle = this.service.create(parsed.data);
      res.status(201).json(vehicle);
    } catch (err) {
      next(err);
    }
  };

  findAll: RequestHandler<{}, Vehicle[], {}, VehicleFilterQuery> = (
    req,
    res,
    next,
  ) => {
    try {
      const { color, brand } = req.query;
      const vehicles = this.service.findAll({ color, brand });
      res.json(vehicles);
    } catch (err) {
      next(err);
    }
  };

  findById: RequestHandler<IdParam, Vehicle> = (req, res, next) => {
    try {
      const vehicle = this.service.findById(req.params.id);
      res.json(vehicle);
    } catch (err) {
      next(err);
    }
  };

  update: RequestHandler<
    IdParam,
    Vehicle,
    { plate?: string; color?: string; brand?: string }
  > = (req, res, next) => {
    try {
      const parsed = updateVehicleSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(parsed.error.issues[0].message, 400);
      }
      const vehicle = this.service.update(req.params.id, parsed.data);
      res.json(vehicle);
    } catch (err) {
      next(err);
    }
  };

  delete: RequestHandler<IdParam> = (req, res, next) => {
    try {
      this.service.delete(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
