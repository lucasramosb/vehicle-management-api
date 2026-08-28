import { Usage } from "../models/usage.model";
import crypto from "crypto";

export class UsageRepository {
  private usages: Usage[] = [];

  create(data: Omit<Usage, "id" | "endDate">): Usage {
    const usage: Usage = {
      id: crypto.randomUUID(),
      ...data,
      endDate: null,
    };
    this.usages.push(usage);
    return usage;
  }

  findById(id: string): Usage | undefined {
    return this.usages.find((u) => u.id === id);
  }

  findAll(): Usage[] {
    return this.usages;
  }

  findActiveByVehicleId(vehicleId: string): Usage | undefined {
    return this.usages.find(
      (u) => u.vehicleId === vehicleId && u.endDate === null,
    );
  }

  findActiveByDriverId(driverId: string): Usage | undefined {
    return this.usages.find(
      (u) => u.driverId === driverId && u.endDate === null,
    );
  }

  finish(id: string): Usage | undefined {
    const index = this.usages.findIndex((u) => u.id === id);
    if (index === -1) return undefined;
    this.usages[index] = { ...this.usages[index], endDate: new Date() };
    return this.usages[index];
  }

  clear(): void {
    this.usages = [];
  }
}
