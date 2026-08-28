import { z } from "zod";

export const createUsageSchema = z.object({
  vehicleId: z.string().min(1, "vehicleId is required"),
  driverId: z.string().min(1, "driverId is required"),
  reason: z.string().min(1, "reason is required"),
});
