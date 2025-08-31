import fs from 'fs/promises';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import fsSync from 'fs';

export const extractText = async (filePath, mimeType) => {
  try {
    if (!fsSync.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      return '';
    }

    if (!mimeType) {
      if (filePath.endsWith('.pdf')) mimeType = 'application/pdf';
      else if (filePath.endsWith('.docx')) mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      else if (filePath.endsWith('.txt')) mimeType = 'text/plain';
    }

    if (mimeType === 'application/pdf') {
      const buf = await fs.readFile(filePath);
      const data = await pdfParse(buf);
      return (data.text || '').trim();
    }

    if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const { value } = await mammoth.extractRawText({ path: filePath });
      return (value || '').trim();
    }

    if (mimeType && mimeType.startsWith('text/')) {
      const text = await fs.readFile(filePath, 'utf-8');
      return text.trim();
    }

    console.warn(`Unsupported mimeType for ${filePath}:`, mimeType);
    return '';
  } catch (err) {
    console.error(`Error extracting text from ${filePath}:`, err);
    return '';
  }
};
