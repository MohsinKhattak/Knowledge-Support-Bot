import { ChunkRepo } from "../../repositories/chunk.repo.js";
import { logger } from "../../config/logger.js";

const DEFAULT_CHUNK_SIZE = 500; // characters per chunk
const CHUNK_OVERLAP = 50; // overlap between chunks for context

/**
 * Split text into chunks with optional overlap
 * @param {string} text - The text to chunk
 * @param {number} chunkSize - Size of each chunk in characters
 * @param {number} overlap - Number of overlapping characters between chunks
 * @returns {array} Array of text chunks
 */
export const chunkText = (text, chunkSize = DEFAULT_CHUNK_SIZE, overlap = CHUNK_OVERLAP) => {
  if (!text || text.length === 0) {
    return [];
  }

  const chunks = [];
  let startIdx = 0;

  while (startIdx < text.length) {
    const endIdx = Math.min(startIdx + chunkSize, text.length);
    const chunk = text.substring(startIdx, endIdx).trim();
    
    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    // Move start index by chunk size minus overlap
    startIdx = endIdx - overlap;

    // Prevent infinite loop if chunk size is very small
    if (startIdx === endIdx - overlap && endIdx === text.length) {
      break;
    }
  }

  return chunks;
};

/**
 * Count tokens in text (approximate using word count)
 * @param {string} text - Text to count tokens for
 * @returns {number} Approximate token count
 */
export const countTokens = (text) => {
  if (!text) return 0;
  // Approximate: 1 token ≈ 4 characters or 0.75 words
  return Math.ceil(text.split(/\s+/).length * 1.3);
};

/**
 * Create chunks from document content and save to database
 * @param {string} documentId - Document ID
 * @param {string} content - Full document content
 * @param {object} options - Chunking options
 * @returns {object} Chunking result
 */
export const createDocumentChunks = async (documentId, content, options = {}) => {
  try {
    const {
      chunkSize = DEFAULT_CHUNK_SIZE,
      overlap = CHUNK_OVERLAP,
    } = options;

    // Split content into chunks
    const textChunks = chunkText(content, chunkSize, overlap);

    if (textChunks.length === 0) {
      throw new Error("No content to chunk");
    }

    console.log(`\n========== CHUNKING DOCUMENT ==========`);
    console.log(`Document ID: ${documentId}`);
    console.log(`Total chunks: ${textChunks.length}`);
    console.log(`Chunk size: ${chunkSize} characters`);
    console.log(`Overlap: ${overlap} characters`);

    // Prepare chunk data for database
    const chunksData = textChunks.map((chunk, index) => ({
      documentId,
      content: chunk,
      chunkIndex: index,
      tokenCount: countTokens(chunk),
      metadata: {
        startChar: index * (chunkSize - overlap),
        endChar: index * (chunkSize - overlap) + chunk.length,
      },
    }));

    // Save chunks to database
    const savedChunks = await ChunkRepo.createChunks(chunksData);

    console.log(`Chunks saved: ${savedChunks.count}`);
    console.log(`Total tokens: ${chunksData.reduce((sum, c) => sum + (c.tokenCount || 0), 0)}`);
    console.log(`\n========== CHUNKING COMPLETE ==========\n`);

    logger.info(`Created ${chunksData.length} chunks for document ${documentId}`);

    return {
      success: true,
      documentId,
      chunkCount: chunksData.length,
      totalTokens: chunksData.reduce((sum, c) => sum + (c.tokenCount || 0), 0),
      chunks: chunksData,
    };
  } catch (error) {
    logger.error(`Error creating chunks for document ${documentId}: ${error.message}`);
    throw error;
  }
};
