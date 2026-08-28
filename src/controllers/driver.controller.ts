import { RequestHandler } from "express";
import { DriverService } from "../services/driver.service";
import {
  createDriverSchema,
  updateDriverSchema,
} from "../schemas/driver.schema";
import { AppError } from "../errors/AppError";
import { Driver } from "../models/driver.model";

type IdParam = { id: string };
type DriverFilterQuery = { name?: string };

export class DriverController {
  constructor(private service: DriverService) {}

  create: RequestHandler<{}, Driver, { name: string }> = (req, res, next) => {
    try {
      const parsed = createDriverSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(parsed.error.issues[0].message, 400);
      }
      const driver = this.service.create(parsed.data);
      res.status(201).json(driver);
    } catch (err) {
      next(err);
    }
  };

  findAll: RequestHandler<{}, Driver[], {}, DriverFilterQuery> = (
    req,
    res,
    next,
  ) => {
    try {
      const { name } = req.query;
      const drivers = this.service.findAll({ name });
      res.json(drivers);
    } catch (err) {
      next(err);
    }
  };

  findById: RequestHandler<IdParam, Driver> = (req, res, next) => {
    try {
      const driver = this.service.findById(req.params.id);
      res.json(driver);
    } catch (err) {
      next(err);
    }
  };

  update: RequestHandler<IdParam, Driver, { name?: string }> = (
    req,
    res,
    next,
  ) => {
    try {
      const parsed = updateDriverSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(parsed.error.issues[0].message, 400);
      }
      const driver = this.service.update(req.params.id, parsed.data);
      res.json(driver);
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
