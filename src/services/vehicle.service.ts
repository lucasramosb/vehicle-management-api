import { VehicleRepository } from "../repositories/vehicle.repository";
import { Vehicle } from "../models/vehicle.model";
import { AppError } from "../errors/AppError";

export class VehicleService {
  constructor(private repository: VehicleRepository) {}

  create(data: { plate: string; color: string; brand: string }): Vehicle {
    return this.repository.create(data);
  }

  findById(id: string): Vehicle {
    const vehicle = this.repository.findById(id);
    if (!vehicle) throw new AppError("Vehicle not found", 404);
    return vehicle;
  }

  findAll(filters?: { color?: string; brand?: string }): Vehicle[] {
    return this.repository.findAll(filters);
  }

  update(
    id: string,
    data: { plate?: string; color?: string; brand?: string },
  ): Vehicle {
    const vehicle = this.repository.update(id, data);
    if (!vehicle) throw new AppError("Vehicle not found", 404);
    return vehicle;
  }

  delete(id: string): void {
    const deleted = this.repository.delete(id);
    if (!deleted) throw new AppError("Vehicle not found", 404);
  }
}
