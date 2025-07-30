const fs = require('fs-extra');
const path = require('path');
const { SignedDocument } = require('../models');

exports.uploadSignedDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No signed document uploaded' });
    }

    const userId = req.user.id;
    const userName = req.user.name;
    const userRole = req.user.role;
    const relativePath = path.relative('uploads', req.file.path);

    const signedDoc = await SignedDocument.create({
      fileName: req.file.originalname,
      filePath: req.file.path,
      uploadedBy: userId,
      name: userName,
      role: userRole,
      userPath: relativePath // Store relative path for easier user directory management
    });

    res.status(201).json({
      message: 'Signed document uploaded successfully',
      documentId: signedDoc.id,
      path: relativePath
    });
  } catch (error) {
    console.error('Error uploading signed document:', error);
    res.status(500).json({ message: 'Error uploading signed document' });
  }
};

exports.getSignedDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const signedDoc = await SignedDocument.findOne({
      where: {
        id,
        uploadedBy: userId // Ensure user can only access their own documents
      }
    });

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

// controller
exports.getUserSignedDocuments = async (req, res) => {
  try {
    const userId = req.user.id;

    const docs = await SignedDocument.findAll({
      where: { uploadedBy: userId }
    });

    res.json(docs); // send to frontend
  } catch (error) {
    console.error('Error fetching user documents:', error);
    res.status(500).json({ message: 'Error fetching documents' });
  }
};

exports.deleteSignedDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const signedDoc = await SignedDocument.findOne({
      where: {
        id,
        uploadedBy: userId // Ensure user can only delete their own documents
      }
    });

    if (!signedDoc) {
      return res.status(404).json({ message: 'Signed document not found' });
    }

    await signedDoc.destroy();
    res.json({ message: 'Signed document deleted successfully' });
  } catch (error) {
    console.error('Error deleting signed document:', error);
    res.status(500).json({ message: 'Error deleting signed document' });
  }
};
