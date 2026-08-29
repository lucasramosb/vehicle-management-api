export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Car Control API",
    version: "1.0.0",
    description: "REST API to manage company vehicle usage",
  },
  servers: [
    {
      url: "http://localhost:3000",
    },
  ],
  tags: [
    { name: "Vehicles", description: "Vehicle management" },
    { name: "Drivers", description: "Driver management" },
    { name: "Usages", description: "Vehicle usage management" },
  ],
  components: {
    schemas: {
      Vehicle: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          },
          plate: { type: "string", example: "ABC-1234" },
          color: { type: "string", example: "red" },
          brand: { type: "string", example: "Toyota" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      CreateVehicle: {
        type: "object",
        required: ["plate", "color", "brand"],
        properties: {
          plate: { type: "string", example: "ABC-1234" },
          color: { type: "string", example: "red" },
          brand: { type: "string", example: "Toyota" },
        },
      },
      UpdateVehicle: {
        type: "object",
        properties: {
          plate: { type: "string", example: "ABC-1234" },
          color: { type: "string", example: "blue" },
          brand: { type: "string", example: "Honda" },
        },
      },
      Driver: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          },
          name: { type: "string", example: "John Doe" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      CreateDriver: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", example: "John Doe" },
        },
      },
      UpdateDriver: {
        type: "object",
        properties: {
          name: { type: "string", example: "John Updated" },
        },
      },
      CreateUsage: {
        type: "object",
        required: ["vehicleId", "driverId", "reason"],
        properties: {
          vehicleId: {
            type: "string",
            example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          },
          driverId: {
            type: "string",
            example: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
          },
          reason: { type: "string", example: "Business trip" },
        },
      },
      Usage: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "c3d4e5f6-a7b8-9012-cdef-123456789012",
          },
          vehicleId: {
            type: "string",
            example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          },
          driverId: {
            type: "string",
            example: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
          },
          reason: { type: "string", example: "Business trip" },
          startDate: { type: "string", format: "date-time" },
          endDate: {
            type: "string",
            format: "date-time",
            nullable: true,
            example: null,
          },
        },
      },
      UsageWithDetails: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "c3d4e5f6-a7b8-9012-cdef-123456789012",
          },
          reason: { type: "string", example: "Business trip" },
          startDate: { type: "string", format: "date-time" },
          endDate: {
            type: "string",
            format: "date-time",
            nullable: true,
            example: null,
          },
          driver: {
            type: "object",
            properties: {
              id: {
                type: "string",
                example: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
              },
              name: { type: "string", example: "John Doe" },
            },
          },
          vehicle: {
            type: "object",
            properties: {
              id: {
                type: "string",
                example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
              },
              plate: { type: "string", example: "ABC-1234" },
              color: { type: "string", example: "red" },
              brand: { type: "string", example: "Toyota" },
            },
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: { type: "string", example: "Vehicle not found" },
        },
      },
    },
  },
  paths: {
    "/vehicles": {
      post: {
        tags: ["Vehicles"],
        summary: "Create a vehicle",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateVehicle" },
            },
          },
        },
        responses: {
          201: {
            description: "Vehicle created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Vehicle" },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      get: {
        tags: ["Vehicles"],
        summary: "List vehicles",
        parameters: [
          {
            name: "color",
            in: "query",
            schema: { type: "string" },
            example: "red",
          },
          {
            name: "brand",
            in: "query",
            schema: { type: "string" },
            example: "Toyota",
          },
        ],
        responses: {
          200: {
            description: "List of vehicles",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Vehicle" },
                },
              },
            },
          },
        },
      },
    },
    "/vehicles/{id}": {
      get: {
        tags: ["Vehicles"],
        summary: "Get vehicle by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Vehicle found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Vehicle" },
              },
            },
          },
          404: {
            description: "Vehicle not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Vehicles"],
        summary: "Update a vehicle",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateVehicle" },
            },
          },
        },
        responses: {
          200: {
            description: "Vehicle updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Vehicle" },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          404: {
            description: "Vehicle not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Vehicles"],
        summary: "Delete a vehicle",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          204: { description: "Vehicle deleted" },
          404: {
            description: "Vehicle not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/drivers": {
      post: {
        tags: ["Drivers"],
        summary: "Create a driver",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateDriver" },
            },
          },
        },
        responses: {
          201: {
            description: "Driver created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Driver" },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      get: {
        tags: ["Drivers"],
        summary: "List drivers",
        parameters: [
          {
            name: "name",
            in: "query",
            schema: { type: "string" },
            example: "John",
          },
        ],
        responses: {
          200: {
            description: "List of drivers",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Driver" },
                },
              },
            },
          },
        },
      },
    },
    "/drivers/{id}": {
      get: {
        tags: ["Drivers"],
        summary: "Get driver by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Driver found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Driver" },
              },
            },
          },
          404: {
            description: "Driver not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Drivers"],
        summary: "Update a driver",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateDriver" },
            },
          },
        },
        responses: {
          200: {
            description: "Driver updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Driver" },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          404: {
            description: "Driver not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Drivers"],
        summary: "Delete a driver",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          204: { description: "Driver deleted" },
          404: {
            description: "Driver not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/usages": {
      post: {
        tags: ["Usages"],
        summary: "Start a vehicle usage",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateUsage" },
            },
          },
        },
        responses: {
          201: {
            description: "Usage created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Usage" },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          404: {
            description: "Vehicle or driver not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          409: {
            description:
              "Vehicle already in use or driver already using a vehicle",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      get: {
        tags: ["Usages"],
        summary: "List all usages",
        responses: {
          200: {
            description: "List of usages with driver and vehicle details",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/UsageWithDetails" },
                },
              },
            },
          },
        },
      },
    },
    "/usages/{id}/finish": {
      patch: {
        tags: ["Usages"],
        summary: "Finish a vehicle usage",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Usage finished",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Usage" },
              },
            },
          },
          404: {
            description: "Usage not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          409: {
            description: "Usage already finished",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
  },
};
