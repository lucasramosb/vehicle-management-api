import { DriverRepository } from "../repositories/driver.repository";
import { Driver } from "../models/driver.model";
import { AppError } from "../errors/AppError";

export class DriverService {
  constructor(private repository: DriverRepository) {}

  create(data: { name: string }): Driver {
    return this.repository.create(data);
  }

  findById(id: string): Driver {
    const driver = this.repository.findById(id);
    if (!driver) throw new AppError("Driver not found", 404);
    return driver;
  }

  findAll(filters?: { name?: string }): Driver[] {
    return this.repository.findAll(filters);
  }

  update(id: string, data: { name?: string }): Driver {
    const driver = this.repository.update(id, data);
    if (!driver) throw new AppError("Driver not found", 404);
    return driver;
  }

  delete(id: string): void {
    const deleted = this.repository.delete(id);
    if (!deleted) throw new AppError("Driver not found", 404);
  }
}
