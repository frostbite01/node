const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { WifiRequestForm, CCTVRequestForm, SoftwareRequestForm } = require('../models');

exports.downloadWifiForm = async (req, res) => {
  try {
    const id = req.params.id;
    const wifi = await WifiRequestForm.findByPk(id);

    if (!wifi) return res.status(404).json({ message: 'WiFi form not found' });

    const templatePath = path.resolve(__dirname, '../templates/form_wifi.docx');
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true
    });

    doc.setData({
      baru: wifi.pengguna_baru,
      pergantian: wifi.pergantian,
      komputer: wifi.komputer,
      laptop: wifi.laptop,
      handphone: wifi.handphone,
      nomor: wifi.nomor,
      serie: wifi.serial_number,
      nama: wifi.nama,
      nrp: wifi.nrp,
      department: wifi.department,
      jabatan: wifi.jabatan,
      mess: wifi.mess,
      diluar: wifi.diluar,
      alamat: wifi.alamat,
      brand: wifi.brand,
      type: wifi.type,
      mac: wifi.mac,
      serial: wifi.serial,
      keperluan: wifi.keperluan,
      hari: wifi.hari,
      te: wifi.te,
      diketahui: wifi.diketahui,
    });

    doc.render();
    const buffer = doc.getZip().generate({ type: 'nodebuffer' });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename=wifi_request_${wifi.id}.docx`);
    res.send(buffer);
  } catch (error) {
    console.error('Error generating WiFi form:', error);
    res.status(500).json({ message: 'Error generating document' });
  }
};

exports.downloadCctvForm = async (req, res) => {
  try {
    const id = req.params.id;
    const cctv = await CCTVRequestForm.findByPk(id);

    if (!cctv) return res.status(404).json({ message: 'CCTV form not found' });

    const templatePath = path.resolve(__dirname, '../templates/form_cctv.docx');
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true
    });

    doc.setData({
      tanggal: cctv.date,
      komputer: cctv.komputer,
      laptop: cctv.laptop,
      handphone: cctv.handphone,
      serie: cctv.serial_number,
      nama: cctv.nama,
      nrp: cctv.nrp,
      department: cctv.department,
      jabatan: cctv.jabatan,
      keperluan: cctv.keperluan,
      disetujui: cctv.disetujui
    });

    doc.render();
    const buffer = doc.getZip().generate({ type: 'nodebuffer' });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename=cctv_request_${cctv.id}.docx`);
    res.send(buffer);
  } catch (error) {
    console.error('Error generating CCTV form:', error);
    res.status(500).json({ message: 'Error generating document' });
  }
};

exports.downloadSoftwareForm = async (req, res) => {
  try {
    const id = req.params.id;
    const software = await SoftwareRequestForm.findByPk(id);

    if (!software) return res.status(404).json({ message: 'Software form not found' });

    const templatePath = path.resolve(__dirname, '../templates/form_software.docx');
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true
    });

    doc.setData({
      tanggal: software.date,
      serie: software.serial_number,
      komputer: software.komputer,
      laptop: software.laptop,
      handphone: software.handphone,
      nama: software.nama,
      nrp: software.nrp,
      department: software.department,
      jabatan: software.jabatan,
      brand: software.brand,
      type: software.type,
      mac: software.mac,
      sn: software.sn,
      software: software.software_name,
      keperluan: software.keperluan,
      disetujui: software.disetujui
    });

    doc.render();
    const buffer = doc.getZip().generate({ type: 'nodebuffer' });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename=software_request_${software.id}.docx`);
    res.send(buffer);
  } catch (error) {
    console.error('Error generating Software form:', error);
    res.status(500).json({ message: 'Error generating document' });
  }
};
