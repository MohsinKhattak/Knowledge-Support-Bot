import { DocumentRepo } from "../repositories/document.repo.js"; 
import { extractDocumentContent } from "../services/document/extract.service.js"; 

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
 
 
    extractDocumentContent(file.path, sourceType)
      .then((content) => {
        console.log(`Extracted content for document ID  :`, content);
         
      })
      .catch((error) => { 
        console.log(`Error extracting content for document ID  : ${error.message}`);
      });

    res.status(201).json({
      success: true,
      message: "Document created successfully",
      data: document,
    });
  } catch (error) {  
    next(error);
  }
};
 