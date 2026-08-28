import { UsageRepository } from "../repositories/usage.repository";
import { VehicleRepository } from "../repositories/vehicle.repository";
import { DriverRepository } from "../repositories/driver.repository";
import { Usage, UsageWithDetails } from "../models/usage.model";
import { AppError } from "../errors/AppError";

export class UsageService {
  constructor(
    private usageRepository: UsageRepository,
    private vehicleRepository: VehicleRepository,
    private driverRepository: DriverRepository,
  ) {}

  create(data: { vehicleId: string; driverId: string; reason: string }): Usage {
    return this.usageRepository.create({
      ...data,
      startDate: new Date(),
    });
  }

  finish(id: string): Usage {
    const usage = this.usageRepository.findById(id);
    if (!usage) throw new AppError("Usage not found", 404);
    const finished = this.usageRepository.finish(id);
    return finished!;
  }

  findAll(): UsageWithDetails[] {
    const usages = this.usageRepository.findAll();
    return usages.map((usage) => {
      const vehicle = this.vehicleRepository.findById(usage.vehicleId)!;
      const driver = this.driverRepository.findById(usage.driverId)!;
      return {
        id: usage.id,
        reason: usage.reason,
        startDate: usage.startDate,
        endDate: usage.endDate,
        driver: { id: driver.id, name: driver.name },
        vehicle: {
          id: vehicle.id,
          plate: vehicle.plate,
          color: vehicle.color,
          brand: vehicle.brand,
        },
      };
    });
  }
}
