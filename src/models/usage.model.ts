export interface Usage {
  id: string;
  vehicleId: string;
  driverId: string;
  reason: string;
  startDate: Date;
  endDate: Date | null;
}

export interface UsageWithDetails {
  id: string;
  reason: string;
  startDate: Date;
  endDate: Date | null;
  driver: {
    id: string;
    name: string;
  };
  vehicle: {
    id: string;
    plate: string;
    color: string;
    brand: string;
  };
}
