import { DocumentRepo } from "../repositories/document.repo.js"; 
import { extractDocumentContent } from "../services/document/extract.service.js"; 
import { createDocumentChunks } from "../services/document/chunk.service.js";
import { logger } from "../config/logger.js";

export const createDocument = async (req, res, next) => {
  try {
    const { title, metadata, organizationId } = req.body; 
    const file = req.file;

    if (!organizationId) {
      return res.status(400).json({ 
        error: "Organization ID is required" 
      });
    }

    if (!title) {
      return res.status(400).json({ 
        error: "Title is required" 
      });
    }

    if (!file) {
      return res.status(400).json({ 
        error: "Document file is required" 
      });
    }
 
    const fileExtension = file.originalname.split(".").pop().toLowerCase();
    const sourceType = fileExtension === "pdf" ? "pdf" : fileExtension;
    const sourceUrl = `/uploads/${file.filename}`;
 
    // Create document record
    const document = await DocumentRepo.createDocument({
      organizationId,
      title,
      sourceType,
      sourceUrl,
      metadata: metadata ? JSON.parse(metadata) : {},
      status: "PENDING",
    });

    logger.info(`Document created: ${document.id}`);
  
    extractDocumentContent(file.path, sourceType)
      .then(async (content) => {
         
        const chunkResult = await createDocumentChunks(document.id, content.text);
        await DocumentRepo.updateStatus(document.id, "READY"); 
        logger.info(`Document ${document.id} chunked successfully: ${chunkResult.chunkCount} chunks`);
      })
      .catch((error) => {  
        logger.error(`Error processing document ${document.id}: ${error.message}`);
         
        DocumentRepo.updateStatus(document.id, "FAILED").catch(err => {
          logger.error(`Failed to update document status: ${err.message}`);
        });
      });

    res.status(201).json({
      success: true,
      message: "Document created successfully. Processing started...",
      data: document,
    });
  } catch (error) {  
    logger.error(`Error creating document: ${error.message}`);
    next(error);
  }
};
 