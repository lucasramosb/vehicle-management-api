import { describe, it, expect, beforeEach } from "vitest";
import { UsageService } from "../src/services/usage.service";
import { UsageRepository } from "../src/repositories/usage.repository";
import { VehicleRepository } from "../src/repositories/vehicle.repository";
import { DriverRepository } from "../src/repositories/driver.repository";
import { VehicleService } from "../src/services/vehicle.service";
import { DriverService } from "../src/services/driver.service";

describe("UsageService", () => {
  let usageRepository: UsageRepository;
  let vehicleRepository: VehicleRepository;
  let driverRepository: DriverRepository;
  let usageService: UsageService;
  let vehicleService: VehicleService;
  let driverService: DriverService;

  beforeEach(() => {
    vehicleRepository = new VehicleRepository();
    driverRepository = new DriverRepository();
    usageRepository = new UsageRepository();

    vehicleService = new VehicleService(vehicleRepository);
    driverService = new DriverService(driverRepository);
    usageService = new UsageService(
      usageRepository,
      vehicleRepository,
      driverRepository,
    );
  });

  it("should create a usage", () => {
    const vehicle = vehicleService.create({
      plate: "ABC-1234",
      color: "red",
      brand: "Toyota",
    });
    const driver = driverService.create({ name: "John Doe" });
    const usage = usageService.create({
      vehicleId: vehicle.id,
      driverId: driver.id,
      reason: "Business trip",
    });
    expect(usage.id).toBeDefined();
    expect(usage.vehicleId).toBe(vehicle.id);
    expect(usage.driverId).toBe(driver.id);
    expect(usage.reason).toBe("Business trip");
    expect(usage.startDate).toBeInstanceOf(Date);
    expect(usage.endDate).toBeNull();
  });

  it("should throw 404 when vehicle not found", () => {
    const driver = driverService.create({ name: "John Doe" });
    expect(() =>
      usageService.create({
        vehicleId: "non-existent",
        driverId: driver.id,
        reason: "Trip",
      }),
    ).toThrowError("Vehicle not found");
  });

  it("should throw 404 when driver not found", () => {
    const vehicle = vehicleService.create({
      plate: "ABC-1234",
      color: "red",
      brand: "Toyota",
    });
    expect(() =>
      usageService.create({
        vehicleId: vehicle.id,
        driverId: "non-existent",
        reason: "Trip",
      }),
    ).toThrowError("Driver not found");
  });

  it("should finish a usage", () => {
    const vehicle = vehicleService.create({
      plate: "ABC-1234",
      color: "red",
      brand: "Toyota",
    });
    const driver = driverService.create({ name: "John Doe" });
    const usage = usageService.create({
      vehicleId: vehicle.id,
      driverId: driver.id,
      reason: "Trip",
    });
    const finished = usageService.finish(usage.id);
    expect(finished.endDate).toBeInstanceOf(Date);
  });

  it("should throw 404 when finishing non-existent usage", () => {
    expect(() => usageService.finish("non-existent-id")).toThrowError(
      "Usage not found",
    );
  });

  it("should throw 409 when finishing already finished usage", () => {
    const vehicle = vehicleService.create({
      plate: "ABC-1234",
      color: "red",
      brand: "Toyota",
    });
    const driver = driverService.create({ name: "John Doe" });
    const usage = usageService.create({
      vehicleId: vehicle.id,
      driverId: driver.id,
      reason: "Trip",
    });
    usageService.finish(usage.id);
    expect(() => usageService.finish(usage.id)).toThrowError(
      "Usage already finished",
    );
  });

  it("should list usages with driver and vehicle details", () => {
    const vehicle = vehicleService.create({
      plate: "ABC-1234",
      color: "red",
      brand: "Toyota",
    });
    const driver = driverService.create({ name: "John Doe" });
    usageService.create({
      vehicleId: vehicle.id,
      driverId: driver.id,
      reason: "Trip",
    });
    const list = usageService.findAll();
    expect(list).toHaveLength(1);
    expect(list[0].driver.name).toBe("John Doe");
    expect(list[0].vehicle.plate).toBe("ABC-1234");
  });

  // --- Cenários de regra de negócio ---

  it("Cenário 1: should throw 409 when vehicle is already in use by another driver", () => {
    const vehicle = vehicleService.create({
      plate: "ABC-1234",
      color: "red",
      brand: "Toyota",
    });
    const driverA = driverService.create({ name: "Driver A" });
    const driverB = driverService.create({ name: "Driver B" });

    usageService.create({
      vehicleId: vehicle.id,
      driverId: driverA.id,
      reason: "Trip A",
    });

    expect(() =>
      usageService.create({
        vehicleId: vehicle.id,
        driverId: driverB.id,
        reason: "Trip B",
      }),
    ).toThrowError("Vehicle is already in use");
  });

  it("Cenário 2: should throw 409 when driver is already using another vehicle", () => {
    const vehicleA = vehicleService.create({
      plate: "ABC-1234",
      color: "red",
      brand: "Toyota",
    });
    const vehicleB = vehicleService.create({
      plate: "DEF-5678",
      color: "blue",
      brand: "Honda",
    });
    const driver = driverService.create({ name: "Driver A" });

    usageService.create({
      vehicleId: vehicleA.id,
      driverId: driver.id,
      reason: "Trip A",
    });

    expect(() =>
      usageService.create({
        vehicleId: vehicleB.id,
        driverId: driver.id,
        reason: "Trip B",
      }),
    ).toThrowError("Driver is already using a vehicle");
  });

  it("Cenário 3: should allow vehicle to be used after previous usage is finished", () => {
    const vehicle = vehicleService.create({
      plate: "ABC-1234",
      color: "red",
      brand: "Toyota",
    });
    const driverA = driverService.create({ name: "Driver A" });
    const driverB = driverService.create({ name: "Driver B" });

    const usage = usageService.create({
      vehicleId: vehicle.id,
      driverId: driverA.id,
      reason: "Trip A",
    });
    usageService.finish(usage.id);

    const newUsage = usageService.create({
      vehicleId: vehicle.id,
      driverId: driverB.id,
      reason: "Trip B",
    });
    expect(newUsage.id).toBeDefined();
    expect(newUsage.endDate).toBeNull();
  });

  it("Cenário 4: should allow driver to use another vehicle after finishing previous usage", () => {
    const vehicleA = vehicleService.create({
      plate: "ABC-1234",
      color: "red",
      brand: "Toyota",
    });
    const vehicleB = vehicleService.create({
      plate: "DEF-5678",
      color: "blue",
      brand: "Honda",
    });
    const driver = driverService.create({ name: "Driver A" });

    const usage = usageService.create({
      vehicleId: vehicleA.id,
      driverId: driver.id,
      reason: "Trip A",
    });
    usageService.finish(usage.id);

    const newUsage = usageService.create({
      vehicleId: vehicleB.id,
      driverId: driver.id,
      reason: "Trip B",
    });
    expect(newUsage.id).toBeDefined();
    expect(newUsage.endDate).toBeNull();
  });
});
