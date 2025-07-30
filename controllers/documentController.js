const fs = require('fs-extra');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

const { Template } = require('../models');

// Create templates directory if it doesn't exist
const templatesDir = path.join(__dirname, '../uploads/templates');
const outputDir = path.join(__dirname, '../generated-docs');

fs.ensureDirSync(templatesDir);
fs.ensureDirSync(outputDir);

exports.getTemplates = async (req, res) => {
  try {
    // Fetch templates from database with full metadata
    const templates = await Template.findAll({
      where: {
        isActive: true
      },
      include: [
        {
          model: require('../models').User,
          as: 'templateUploader',
          attributes: ['id', 'name', 'username', 'email']
        }
      ],
      order: [['uploadDate', 'DESC']]
    });

    res.json({
      success: true,
      count: templates.length,
      templates: templates.map(template => ({
        id: template.id,
        templateName: template.templateName,
        filename: template.filename,
        description: template.description,
        uploadDate: template.uploadDate,
        fileSize: template.fileSize,
        isActive: template.isActive,
        directory: template.directory,
        uploadedBy: template.uploadedBy,
        templateFields: template.templateFields, // INCLUDE THE FIELDS
        uploader: template.templateUploader ? {
          id: template.templateUploader.id,
          name: template.templateUploader.name,
          username: template.templateUploader.username,
          email: template.templateUploader.email
        } : null,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt
      }))
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching templates',
      error: error.message 
    });
  }
};

// 2. Get template fields for form generation
exports.getTemplateFields = async (req, res) => {
  try {
    const { templateId, templateName } = req.params;
    
    console.log('=== GET TEMPLATE FIELDS DEBUG ===');
    console.log('Requested template ID:', templateId);
    console.log('Requested template name:', templateName);
    
    let template;
    
    // Handle both templateId and templateName
    if (templateId && !isNaN(templateId)) {
      // Search by ID
      template = await Template.findByPk(templateId);
    } else if (templateName) {
      // Search by filename
      template = await Template.findOne({
        where: { filename: templateName }
      });
    }
    
    if (!template) {
      console.log('Template not found in database');
      
      // Let's also check what templates actually exist
      const allTemplates = await Template.findAll({
        attributes: ['id', 'templateName', 'filename'],
        raw: true
      });
      
      console.log('Available templates in database:', allTemplates);
      
      return res.status(404).json({ 
        success: false,
        message: 'Template not found',
        debug: {
          requestedId: templateId,
          requestedName: templateName,
          availableTemplates: allTemplates
        }
      });
    }

    console.log('Template found:', {
      id: template.id,
      templateName: template.templateName,
      filename: template.filename,
      templateFields: template.templateFields
    });

    // Handle templateFields whether it's a string or array
    let fields = [];
    if (template.templateFields) {
      if (typeof template.templateFields === 'string') {
        // Parse string to array
        try {
          fields = JSON.parse(template.templateFields);
        } catch (parseError) {
          console.error('Error parsing templateFields:', parseError);
          fields = [];
        }
      } else if (Array.isArray(template.templateFields)) {
        fields = template.templateFields;
      }
    }

    console.log('Parsed fields:', fields);

    res.json({
      success: true,
      templateId: template.id,
      templateName: template.templateName,
      filename: template.filename,
      fields: fields
    });
  } catch (error) {
    console.error('Error getting template fields:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error getting template fields',
      error: error.message 
    });
  }
};

// 3. Fill template with user data
exports.fillTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const formData = req.body; // This comes from the frontend form
    
    console.log('Filling template with data:', formData);
    
    const template = await Template.findByPk(templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    const templatePath = path.join(template.directory, template.filename);
    
    // Read template
    const content = await fs.readFile(templatePath, 'binary');
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip);

    try {
      // Fill the template with user data
      doc.render(formData);
      console.log('Template rendered successfully');
    } catch (renderError) {
      console.error('Error rendering template:', renderError);
      return res.status(400).json({ 
        message: 'Error filling template',
        details: renderError.message 
      });
    }

    // Generate filled document
    const buf = doc.getZip().generate({ type: 'nodebuffer' });
    
    // Set headers for automatic download
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const downloadFilename = `filled_${template.templateName}_${timestamp}.docx`;
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${downloadFilename}"`);
    res.setHeader('Content-Length', buf.length);
    
    // Send the filled document
    res.send(buf);
    
    console.log('Filled document sent for download:', downloadFilename);
  } catch (error) {
    console.error('Error filling template:', error);
    res.status(500).json({ message: 'Error filling template' });
  }
};

// 1. Upload template with automatic field extraction
exports.uploadTemplate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No template file uploaded' });
    }

    if (!req.file.originalname.endsWith('.docx')) {
      return res.status(400).json({ message: 'Only .docx files are allowed' });
    }

    // File is already in the correct location (/uploads/templates)
    const templatePath = req.file.path;
    
    // Get file stats for metadata
    const fileStats = await fs.stat(templatePath);
    
    // Extract template name without extension
    const templateName = req.file.originalname.replace('.docx', '');
    
    // Get user ID from request (assuming you have authentication middleware)
    const uploadedBy = req.user ? req.user.id : null;

    // EXTRACT FIELDS FROM TEMPLATE
    console.log('Extracting fields from template...');
    let extractedFields = [];
    
    try {
      const content = await fs.readFile(templatePath, 'binary');
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip);
      
      const fullText = doc.getFullText();
      console.log('Template full text length:', fullText.length);
      
      // Extract all tags/placeholders from the template
      const tags = fullText.match(/\{[^}]+\}/g) || [];
      console.log('Found raw tags:', tags);
      
      // Clean up tags and get unique fields
      extractedFields = [...new Set(tags.map(tag => tag.replace(/[{}]/g, '')))];
      console.log('Extracted unique fields:', extractedFields);
      
    } catch (extractionError) {
      console.error('Error extracting fields from template:', extractionError);
      // Continue without fields if extraction fails
      extractedFields = [];
    }

    // Save template metadata to database WITH EXTRACTED FIELDS
    const templateRecord = await Template.create({
      templateName: templateName,
      filename: req.file.originalname,
      description: req.body.description || null, // Allow description from form data
      uploadDate: new Date(),
      directory: templatesDir,
      isActive: true,
      fileSize: fileStats.size,
      uploadedBy: uploadedBy,
      templateFields: extractedFields // STORE THE EXTRACTED FIELDS
    });

    res.status(201).json({ 
      message: 'Template uploaded successfully',
      templateName: req.file.originalname,
      templateId: templateRecord.id,
      extractedFields: extractedFields, // Return the extracted fields
      metadata: {
        id: templateRecord.id,
        templateName: templateRecord.templateName,
        filename: templateRecord.filename,
        description: templateRecord.description,
        uploadDate: templateRecord.uploadDate,
        fileSize: templateRecord.fileSize,
        isActive: templateRecord.isActive,
        fields: extractedFields // Include fields in metadata
      }
    });
  } catch (error) {
    console.error('Error uploading template:', error);
    res.status(500).json({ message: 'Error uploading template' });
  }
};

exports.deleteTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    
    console.log('=== DELETE TEMPLATE DEBUG ===');
    console.log('Template ID requested:', templateId);
    console.log('User ID:', req.user.id);
    console.log('User role:', req.user.role);
    
    // Validate templateId
    if (!templateId || isNaN(templateId)) {
      console.log('Invalid template ID provided');
      return res.status(400).json({ 
        success: false,
        message: 'Invalid template ID provided',
        debug: {
          templateId: templateId,
          type: typeof templateId
        }
      });
    }

    // Find the template in database
    console.log('Searching for template in database...');
    const template = await Template.findByPk(templateId);
    
    if (!template) {
      console.log('Template not found in database');
      
      // Let's also check what templates actually exist
      const allTemplates = await Template.findAll({
        attributes: ['id', 'templateName', 'filename'],
        raw: true
      });
      
      console.log('Available templates in database:', allTemplates);
      
      return res.status(404).json({ 
        success: false,
        message: 'Template not found',
        debug: {
          requestedId: templateId,
          availableTemplates: allTemplates
        }
      });
    }

    console.log('Template found:', {
      id: template.id,
      templateName: template.templateName,
      filename: template.filename,
      uploadedBy: template.uploadedBy
    });

    // Check if user has permission to delete (admin or the uploader)
    const isAdmin = req.user.role === 'admin';
    const isUploader = template.uploadedBy === req.user.id;
    
    console.log('Permission check:', {
      isAdmin: isAdmin,
      isUploader: isUploader,
      userRole: req.user.role,
      templateUploadedBy: template.uploadedBy,
      currentUserId: req.user.id
    });
    
    if (!isAdmin && !isUploader) {
      console.log('Permission denied');
      return res.status(403).json({ 
        success: false,
        message: 'You do not have permission to delete this template',
        debug: {
          userRole: req.user.role,
          templateUploadedBy: template.uploadedBy,
          currentUserId: req.user.id
        }
      });
    }

    // Delete the physical file
    const filePath = path.join(template.directory, template.filename);
    console.log('Attempting to delete file:', filePath);
    
    try {
      if (await fs.pathExists(filePath)) {
        await fs.remove(filePath);
        console.log('File deleted successfully');
      } else {
        console.log('File not found at path:', filePath);
      }
    } catch (fileError) {
      console.error('Error deleting file:', fileError);
      // Continue with database deletion even if file deletion fails
    }

    // Delete from database
    console.log('Deleting from database...');
    await template.destroy();
    console.log('Database record deleted successfully');

    res.json({ 
      success: true,
      message: 'Template deleted successfully',
      deletedTemplate: {
        id: template.id,
        templateName: template.templateName,
        filename: template.filename
      },
      debug: {
        filePath: filePath,
        fileExists: await fs.pathExists(filePath)
      }
    });
  } catch (error) {
    console.error('=== DELETE TEMPLATE ERROR ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ 
      success: false,
      message: 'Error deleting template',
      error: error.message,
      debug: {
        templateId: req.params.templateId,
        userId: req.user?.id,
        userRole: req.user?.role
      }
    });
  }
};