import { AppError } from "../errors/AppError";
import { Usage, UsageWithDetails } from "../models/usage.model";
import { DriverRepository } from "../repositories/driver.repository";
import { UsageRepository } from "../repositories/usage.repository";
import { VehicleRepository } from "../repositories/vehicle.repository";

export class UsageService {
  constructor(
    private usageRepository: UsageRepository,
    private vehicleRepository: VehicleRepository,
    private driverRepository: DriverRepository,
  ) {}

  create(data: { vehicleId: string; driverId: string; reason: string }): Usage {
    const vehicle = this.vehicleRepository.findById(data.vehicleId);
    if (!vehicle) throw new AppError("Vehicle not found", 404);

    const driver = this.driverRepository.findById(data.driverId);
    if (!driver) throw new AppError("Driver not found", 404);

    const vehicleInUse = this.usageRepository.findActiveByVehicleId(
      data.vehicleId,
    );
    if (vehicleInUse) throw new AppError("Vehicle is already in use", 409);

    const driverInUse = this.usageRepository.findActiveByDriverId(
      data.driverId,
    );
    if (driverInUse)
      throw new AppError("Driver is already using a vehicle", 409);

    return this.usageRepository.create({
      ...data,
      startDate: new Date(),
    });
  }

  finish(id: string): Usage {
    const usage = this.usageRepository.findById(id);
    if (!usage) throw new AppError("Usage not found", 404);

    if (usage.endDate !== null)
      throw new AppError("Usage already finished", 409);

    return this.usageRepository.finish(id)!;
  }

  findAll(): UsageWithDetails[] {
    return this.usageRepository.findAll().map((usage) => {
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
