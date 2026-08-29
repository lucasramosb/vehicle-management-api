import { RequestHandler } from "express";
import { UsageService } from "../services/usage.service";
import { createUsageSchema } from "../schemas/usage.schema";
import { AppError } from "../errors/AppError";
import { Usage, UsageWithDetails } from "../models/usage.model";

type IdParam = { id: string };
type CreateUsageBody = { vehicleId: string; driverId: string; reason: string };

export class UsageController {
  constructor(private service: UsageService) {}

  create: RequestHandler<{}, Usage, CreateUsageBody> = (req, res, next) => {
    try {
      const parsed = createUsageSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(parsed.error.issues[0].message, 400);
      }
      const usage = this.service.create(parsed.data);
      res.status(201).json(usage);
    } catch (err) {
      next(err);
    }
  };

  findAll: RequestHandler<{}, UsageWithDetails[]> = (_req, res, next) => {
    try {
      const usages = this.service.findAll();
      res.json(usages);
    } catch (err) {
      next(err);
    }
  };

  finish: RequestHandler<IdParam, Usage> = (req, res, next) => {
    try {
      const usage = this.service.finish(req.params.id);
      res.json(usage);
    } catch (err) {
      next(err);
    }
  };
}
