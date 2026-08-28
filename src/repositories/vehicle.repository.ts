import { Vehicle } from "../models/vehicle.model";
import crypto from "crypto";

export class VehicleRepository {
  private vehicles: Vehicle[] = [];

  create(data: Omit<Vehicle, "id" | "createdAt">): Vehicle {
    const vehicle: Vehicle = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
    };
    this.vehicles.push(vehicle);
    return vehicle;
  }

  findById(id: string): Vehicle | undefined {
    return this.vehicles.find((v) => v.id === id);
  }

  findAll(filters?: { color?: string; brand?: string }): Vehicle[] {
    return this.vehicles.filter((v) => {
      if (
        filters?.color &&
        !v.color.toLowerCase().includes(filters.color.toLowerCase())
      ) {
        return false;
      }
      if (
        filters?.brand &&
        !v.brand.toLowerCase().includes(filters.brand.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }

  update(
    id: string,
    data: Partial<Omit<Vehicle, "id" | "createdAt">>,
  ): Vehicle | undefined {
    const index = this.vehicles.findIndex((v) => v.id === id);
    if (index === -1) return undefined;
    this.vehicles[index] = { ...this.vehicles[index], ...data };
    return this.vehicles[index];
  }

  delete(id: string): boolean {
    const index = this.vehicles.findIndex((v) => v.id === id);
    if (index === -1) return false;
    this.vehicles.splice(index, 1);
    return true;
  }

  clear(): void {
    this.vehicles = [];
  }
}
