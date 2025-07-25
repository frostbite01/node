const fs = require('fs-extra');
const path = require('path');
const { SignedDocument } = require('../models');

// Create signed documents directory
const signedDocsDir = path.join(__dirname, '../uploads/signed-documents');
fs.ensureDirSync(signedDocsDir);

exports.uploadSignedDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No signed document uploaded' });
    }

    const signedDoc = await SignedDocument.create({
      fileName: req.file.originalname,
      filePath: req.file.path,
      uploadedBy: req.user.id // From auth middleware
    });

    res.status(201).json({
      message: 'Signed document uploaded successfully',
      documentId: signedDoc.id
    });
  } catch (error) {
    console.error('Error uploading signed document:', error);
    res.status(500).json({ message: 'Error uploading signed document' });
  }
};

exports.getSignedDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const signedDoc = await SignedDocument.findByPk(id);

    if (!signedDoc) {
      return res.status(404).json({ message: 'Signed document not found' });
    }

    res.download(signedDoc.filePath);
  } catch (error) {
    console.error('Error fetching signed document:', error);
    res.status(500).json({ message: 'Error fetching signed document' });
  }
};

exports.getAllSignedDocuments = async (req, res) => {
  try {
    const docs = await SignedDocument.findAll({
      include: ['uploadedBy']
    });
    res.json(docs);
  } catch (error) {
    console.error('Error fetching signed documents:', error);
    res.status(500).json({ message: 'Error fetching signed documents' });
  }
};