import { Driver } from "../models/driver.model";
import crypto from "crypto";

export class DriverRepository {
  private drivers: Driver[] = [];

  create(data: Omit<Driver, "id" | "createdAt">): Driver {
    const driver: Driver = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
    };
    this.drivers.push(driver);
    return driver;
  }

  findById(id: string): Driver | undefined {
    return this.drivers.find((d) => d.id === id);
  }

  findAll(filters?: { name?: string }): Driver[] {
    return this.drivers.filter((d) => {
      if (
        filters?.name &&
        !d.name.toLowerCase().includes(filters.name.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }

  update(
    id: string,
    data: Partial<Omit<Driver, "id" | "createdAt">>,
  ): Driver | undefined {
    const index = this.drivers.findIndex((d) => d.id === id);
    if (index === -1) return undefined;
    this.drivers[index] = { ...this.drivers[index], ...data };
    return this.drivers[index];
  }

  delete(id: string): boolean {
    const index = this.drivers.findIndex((d) => d.id === id);
    if (index === -1) return false;
    this.drivers.splice(index, 1);
    return true;
  }

  clear(): void {
    this.drivers = [];
  }
}
