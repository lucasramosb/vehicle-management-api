import { describe, it, expect, beforeEach } from "vitest";
import { VehicleService } from "../src/services/vehicle.service";
import { VehicleRepository } from "../src/repositories/vehicle.repository";

describe("VehicleService", () => {
  let repository: VehicleRepository;
  let service: VehicleService;

  beforeEach(() => {
    repository = new VehicleRepository();
    service = new VehicleService(repository);
  });

  it("should create a vehicle", () => {
    const vehicle = service.create({
      plate: "ABC-1234",
      color: "red",
      brand: "Toyota",
    });
    expect(vehicle.id).toBeDefined();
    expect(vehicle.plate).toBe("ABC-1234");
    expect(vehicle.color).toBe("red");
    expect(vehicle.brand).toBe("Toyota");
    expect(vehicle.createdAt).toBeInstanceOf(Date);
  });

  it("should find a vehicle by id", () => {
    const created = service.create({
      plate: "ABC-1234",
      color: "red",
      brand: "Toyota",
    });
    const found = service.findById(created.id);
    expect(found.id).toBe(created.id);
  });

  it("should throw 404 when vehicle not found by id", () => {
    expect(() => service.findById("non-existent-id")).toThrowError(
      "Vehicle not found",
    );
  });

  it("should list all vehicles", () => {
    service.create({ plate: "ABC-1234", color: "red", brand: "Toyota" });
    service.create({ plate: "DEF-5678", color: "blue", brand: "Honda" });
    const vehicles = service.findAll();
    expect(vehicles).toHaveLength(2);
  });

  it("should filter vehicles by color", () => {
    service.create({ plate: "ABC-1234", color: "red", brand: "Toyota" });
    service.create({ plate: "DEF-5678", color: "blue", brand: "Honda" });
    const vehicles = service.findAll({ color: "red" });
    expect(vehicles).toHaveLength(1);
    expect(vehicles[0].color).toBe("red");
  });

  it("should filter vehicles by brand", () => {
    service.create({ plate: "ABC-1234", color: "red", brand: "Toyota" });
    service.create({ plate: "DEF-5678", color: "blue", brand: "Honda" });
    const vehicles = service.findAll({ brand: "Honda" });
    expect(vehicles).toHaveLength(1);
    expect(vehicles[0].brand).toBe("Honda");
  });

  it("should update a vehicle", () => {
    const created = service.create({
      plate: "ABC-1234",
      color: "red",
      brand: "Toyota",
    });
    const updated = service.update(created.id, { color: "blue" });
    expect(updated.color).toBe("blue");
    expect(updated.plate).toBe("ABC-1234");
  });

  it("should throw 404 when updating non-existent vehicle", () => {
    expect(() =>
      service.update("non-existent-id", { color: "blue" }),
    ).toThrowError("Vehicle not found");
  });

  it("should delete a vehicle", () => {
    const created = service.create({
      plate: "ABC-1234",
      color: "red",
      brand: "Toyota",
    });
    service.delete(created.id);
    expect(() => service.findById(created.id)).toThrowError(
      "Vehicle not found",
    );
  });

  it("should throw 404 when deleting non-existent vehicle", () => {
    expect(() => service.delete("non-existent-id")).toThrowError(
      "Vehicle not found",
    );
  });
});
