import { describe, it, expect, beforeEach } from "vitest";
import { DriverService } from "../src/services/driver.service";
import { DriverRepository } from "../src/repositories/driver.repository";

describe("DriverService", () => {
  let repository: DriverRepository;
  let service: DriverService;

  beforeEach(() => {
    repository = new DriverRepository();
    service = new DriverService(repository);
  });

  it("should create a driver", () => {
    const driver = service.create({ name: "John Doe" });
    expect(driver.id).toBeDefined();
    expect(driver.name).toBe("John Doe");
    expect(driver.createdAt).toBeInstanceOf(Date);
  });

  it("should find a driver by id", () => {
    const created = service.create({ name: "John Doe" });
    const found = service.findById(created.id);
    expect(found.id).toBe(created.id);
  });

  it("should throw 404 when driver not found by id", () => {
    expect(() => service.findById("non-existent-id")).toThrowError(
      "Driver not found",
    );
  });

  it("should list all drivers", () => {
    service.create({ name: "John Doe" });
    service.create({ name: "Jane Doe" });
    const drivers = service.findAll();
    expect(drivers).toHaveLength(2);
  });

  it("should filter drivers by name", () => {
    service.create({ name: "John Doe" });
    service.create({ name: "Jane Smith" });
    const drivers = service.findAll({ name: "John" });
    expect(drivers).toHaveLength(1);
    expect(drivers[0].name).toBe("John Doe");
  });

  it("should update a driver", () => {
    const created = service.create({ name: "John Doe" });
    const updated = service.update(created.id, { name: "John Updated" });
    expect(updated.name).toBe("John Updated");
  });

  it("should throw 404 when updating non-existent driver", () => {
    expect(() =>
      service.update("non-existent-id", { name: "Test" }),
    ).toThrowError("Driver not found");
  });

  it("should delete a driver", () => {
    const created = service.create({ name: "John Doe" });
    service.delete(created.id);
    expect(() => service.findById(created.id)).toThrowError("Driver not found");
  });

  it("should throw 404 when deleting non-existent driver", () => {
    expect(() => service.delete("non-existent-id")).toThrowError(
      "Driver not found",
    );
  });
});
