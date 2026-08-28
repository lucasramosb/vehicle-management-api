import { z } from "zod";

export const createVehicleSchema = z.object({
  plate: z.string().min(1, "Plate is required"),
  color: z.string().min(1, "Color is required"),
  brand: z.string().min(1, "Brand is required"),
});

export const updateVehicleSchema = z.object({
  plate: z.string().min(1).optional(),
  color: z.string().min(1).optional(),
  brand: z.string().min(1).optional(),
});
