import { OrganizationRepo } from "../repositories/organization.repo.js";

export const createOrganization = async (req, res) => {
  const { name, slug } = req.body;  
  if(!name || !slug){
    return res.status(400).json({error:"Name and Slug are required"});
  }
    try {   
      const organization = await OrganizationRepo.create({ name, slug });
      res.status(201).json(organization);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

export const listOrganizations = async (req, res) => {
  try {
    const organizations = await OrganizationRepo.list();
    res.status(200).json(organizations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getOrganizationById = async (req, res) => {
  const { id } = req.params;
  if(!id){
    return res.status(400).json({error:"ID is required"});
  }
  try {
    const organization = await OrganizationRepo.findById(id);
    if(!organization){
      return res.status(404).json({error:"Organization not found"});
    }
    res.status(200).json(organization);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const updateOrganization = async (req, res) => {
  const { id } = req.params;
  const { name, slug } = req.body;
  if(!id){
    return res.status(400).json({error:"ID is required"});
  }
  try {
    const organization = await OrganizationRepo.update(id, { name, slug });
    res.status(200).json(organization);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const deleteOrganization = async (req, res) => {
  const { id } = req.params;
  if(!id){
    return res.status(400).json({error:"ID is required"});
  }
  try {
    const organization = await OrganizationRepo.delete(id);
    res.status(200).json(organization);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}