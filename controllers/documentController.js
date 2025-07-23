const fs = require('fs-extra');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

// Create templates directory if it doesn't exist
const templatesDir = path.join(__dirname, '../templates');
const outputDir = path.join(__dirname, '../generated-docs');

fs.ensureDirSync(templatesDir);
fs.ensureDirSync(outputDir);

exports.getTemplates = async (req, res) => {
  try {
    const templates = await fs.readdir(templatesDir);
    const docxTemplates = templates.filter(file => file.endsWith('.docx'));
    res.json(docxTemplates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ message: 'Error fetching templates' });
  }
};

exports.getTemplateFields = async (req, res) => {
  try {
    const { templateName } = req.params;
    const templatePath = path.join(templatesDir, templateName);
    
    if (!await fs.pathExists(templatePath)) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Read template and extract placeholders
    const content = await fs.readFile(templatePath, 'binary');
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip);
    
    // Get the full text and log it for debugging
    const fullText = doc.getFullText();
    console.log('Full text from template:', fullText);
    
    // Extract all tags/placeholders from the template
    const tags = fullText.match(/\{[^}]+\}/g) || [];
    console.log('Found tags:', tags);
    
    const uniqueTags = [...new Set(tags.map(tag => tag.replace(/[{}]/g, '')))];
    console.log('Unique tags:', uniqueTags);
    
    res.json({ 
      templateName,
      fields: uniqueTags,
      debug: {
        fullTextLength: fullText.length,
        rawTags: tags
      }
    });
  } catch (error) {
    console.error('Error reading template:', error);
    res.status(500).json({ message: 'Error reading template' });
  }
};

exports.fillTemplate = async (req, res) => {
  try {
    const { templateName } = req.params;
    const formData = req.body;
    
    console.log('Template name:', templateName);
    console.log('Form data received:', formData);
    
    const templatePath = path.join(templatesDir, templateName);
    
    if (!await fs.pathExists(templatePath)) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Read template
    const content = await fs.readFile(templatePath, 'binary');
    const zip = new PizZip(content);
    
    // Use the correct modern API - pass data directly to constructor
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    try {
      // Use render with data directly (modern API)
      doc.render(formData);
      console.log('Template rendered successfully');
    } catch (error) {
      console.error('Error rendering template:', error);
      return res.status(400).json({ 
        message: 'Error filling template',
        details: error.message 
      });
    }

    // Generate output
    const buf = doc.getZip().generate({ type: 'nodebuffer' });
    console.log('Buffer generated, size:', buf.length);
    
    // Save filled document
    const timestamp = Date.now();
    const outputFileName = `${templateName.replace('.docx', '')}_filled_${timestamp}.docx`;
    const outputPath = path.join(outputDir, outputFileName);
    
    await fs.writeFile(outputPath, buf);
    console.log('File written successfully at:', outputPath);

    // Send file as download
    res.download(outputPath, outputFileName, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).json({ message: 'Error sending file' });
      } else {
        console.log('File sent successfully');
      }
    });

  } catch (error) {
    console.error('Error filling template:', error);
    res.status(500).json({ message: 'Error processing template', details: error.message });
  }
};

exports.uploadTemplate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No template file uploaded' });
    }

    if (!req.file.originalname.endsWith('.docx')) {
      return res.status(400).json({ message: 'Only .docx files are allowed' });
    }

    const templatePath = path.join(templatesDir, req.file.originalname);
    await fs.move(req.file.path, templatePath);

    res.status(201).json({ 
      message: 'Template uploaded successfully',
      templateName: req.file.originalname 
    });
  } catch (error) {
    console.error('Error uploading template:', error);
    res.status(500).json({ message: 'Error uploading template' });
  }
};