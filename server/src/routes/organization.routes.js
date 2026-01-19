import express from "express"
const router=express.Router();


import { createOrganization, listOrganizations, getOrganizationById, updateOrganization, deleteOrganization } from '../controllers/organization.controller.js';

router.post("/", createOrganization);
router.get("/", listOrganizations);
router.get("/:id", getOrganizationById);
router.put("/:id", updateOrganization);
router.delete("/:id", deleteOrganization);

export default router;