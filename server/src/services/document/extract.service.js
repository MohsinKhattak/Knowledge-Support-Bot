import fs from "fs/promises";   
import {PDFParse} from "pdf-parse";
export const extractPdfContent = async (filePath) => {
  try {  
    const parser=new PDFParse({url:filePath});
    const data = await parser.getText(); 
    
    return {
      text: data.text,
      numpages: data.numpages,
      metadata: data.metadata,
      info: data.info,
      version: data.version,
    };
  } catch (error) { 
    throw new Error(`Failed to extract PDF content: ${error.message}`);
  }
};

export const extractDocumentContent = async (filePath, fileType) => {
  try {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return await extractPdfContent(filePath);
      
      case "txt":
        const textContent = await fs.readFile(filePath, "utf-8");
        console.log("Extracted text content length:", textContent.length);
        return {
          text: textContent,
          type: "text",
        };
      
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {  
    throw error;
  }
};
