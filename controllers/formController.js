const { Form, Placeholder, Submission, SubmissionData, sequelize } = require('../models');

// Get all forms
exports.getForms = async (req, res) => {
  try {
    const forms = await Form.findAll({
      include: [{
        model: Placeholder,
        attributes: ['key_name', 'label', 'type', 'options', 'order_index']
      }]
    });

    res.json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ message: 'Error fetching forms' });
  }
};

// Create form submission
exports.createSubmission = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { formId } = req.params;
    const { data } = req.body;

    // Get form with its serial number placeholder
    const form = await Form.findByPk(formId, { 
      lock: true,
      include: [{
        model: Placeholder,
        where: { key_name: 'serial_number' },
        required: false
      }]
    });

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Get serial placeholder ID
    const serialPlaceholder = form.Placeholders[0];
    if (!serialPlaceholder) {
      return res.status(500).json({ 
        message: 'Form missing serial number placeholder' 
      });
    }

    // Generate next serial number
    const serialNumber = await form.generateSerialNumber(t);

    // Create submission
    const submission = await Submission.create({
      form_id: formId,
      serial_number: serialNumber
    }, { transaction: t });

    // Add serial number to submission data
    const submissionData = [
      {
        submission_id: submission.id,
        placeholder_id: serialPlaceholder.id, // Use the actual placeholder ID
        value: serialNumber
      },
      ...data.map(d => ({
        submission_id: submission.id,
        placeholder_id: d.placeholder_id,
        value: d.value
      }))
    ];

    await SubmissionData.bulkCreate(submissionData, { transaction: t });

    await t.commit();

    res.status(201).json({
      message: 'Submission created successfully',
      submission,
      serial_number: serialNumber
    });
  } catch (error) {
    await t.rollback();
    console.error('Error creating submission:', error);
    res.status(500).json({ message: 'Error creating submission' });
  }
};

// Create new form
exports.createForm = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { name, description, code_prefix, file_path, placeholders } = req.body;

    // Create form
    const form = await Form.create({
      name,
      description,
      code_prefix,
      file_path
    }, { transaction: t });

    // Add serial number placeholder first
    const serialPlaceholder = await Placeholder.create({
      form_id: form.id,
      key_name: 'serial_number',
      label: 'Serial Number',
      type: 'text',
      order_index: 0
    }, { transaction: t });

    // Update form with serial placeholder ID
    await form.update({
      serial_placeholder_id: serialPlaceholder.id
    }, { transaction: t });

    // Create other placeholders if provided
    if (placeholders && placeholders.length > 0) {
      await Placeholder.bulkCreate(
        placeholders.map((p, idx) => ({
          form_id: form.id,
          key_name: p.key_name,
          label: p.label,
          type: p.type,
          options: p.options,
          order_index: idx + 1 // Start after serial number
        })),
        { transaction: t }
      );
    }

    await t.commit();

    res.status(201).json({
      message: 'Form created successfully',
      form: {
        id: form.id,
        name: form.name,
        description: form.description,
        code_prefix: form.code_prefix,
        file_path: form.file_path
      }
    });
  } catch (error) {
    await t.rollback();
    console.error('Error creating form:', error);
    res.status(500).json({ 
      message: 'Error creating form',
      error: error.message 
    });
  }
};