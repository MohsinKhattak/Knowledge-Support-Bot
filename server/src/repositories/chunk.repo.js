import { prisma } from "../config/prisma.js";

export const ChunkRepo = {
  createChunks: async (chunks) => { 
    return prisma.chunk.createMany({ data: chunks });
  },

  findByDocument: async (documentId) => {
    return prisma.chunk.findMany({
      where: { documentId },
      orderBy: { chunkIndex: "asc" },
    });
  },
};
