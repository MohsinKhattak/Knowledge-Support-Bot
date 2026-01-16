import { prisma } from "../config/prisma.js";

export const DocumentRepo = {
  createDocument: async (data) => {
    return prisma.document.create({ data });
  },

  findById: async (id) => {
    return prisma.document.findUnique({
      where: { id },
      include: { chunks: true, organization: true },
    });
  },

  updateStatus: async (id, status) => {
    return prisma.document.update({
      where: { id },
      data: { status },
    });
  },

  findAllByOrganization: async (organizationId) => {
    return prisma.document.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    });
  },
};
