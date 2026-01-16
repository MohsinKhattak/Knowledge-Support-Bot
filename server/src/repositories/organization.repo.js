import { prisma } from "../config/prisma.js";

export const OrganizationRepo = {
  create: async (data) => prisma.organization.create({ data }),
  findById: async (id) => prisma.organization.findUnique({ where: { id } }),
  findAll: async () => prisma.organization.findMany(),
};
