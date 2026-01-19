import { prisma } from "../config/prisma.js";

export const OrganizationRepo = {
  create: async (data) => prisma.organization.create({ data:{
    name: data.name, slug:data.slug
  } }),
  findById: async (id) => prisma.organization.findUnique({ where: { id } }),
  findBySlug: async (slug) => prisma.organization.findUnique({ where: { slug } }),
  list: async () => prisma.organization.findMany(),
  update: async (id, data) => prisma.organization.update({ where: { id }, data }),
  delete: async (id) => prisma.organization.delete({ where: { id } }),
};
