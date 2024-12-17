const express = require('express');
const multer = require('multer');
const Report = require('../models/Report');
const jwt = require('jsonwebtoken');  
const path = require('path');

// multer para imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); 
    },
});

const upload = multer({ storage });

const router = express.Router();

// obtener los reportes con filtros
router.get('/', async (req, res) => {
    try {
        const { status, category, province } = req.query;
        
        const filter = {};

        if (status) {
            filter.status = status;
        }
        if (category) {
            filter.category = category;
        }
        if (province) {
            filter.province = { $regex: new RegExp(`^${province.trim()}$`, 'i') };
        }

        // Obtener reportes con filtros
        const reports = await Report.find(filter).populate('userId', 'firstName lastName email');
        console.log('Reportes encontrados:', reports);
        res.status(200).json(reports);  
    } catch (error) {
        console.error('Error al obtener los reportes:', error);
        res.status(500).json({ message: 'Error al obtener los reportes', error });
    }
});

// crear reporte con imágenes
router.post('/', upload.array('images', 5), async (req, res) => {
    try {
        const { category, description, province, canton, reportType, status } = req.body;

        //verificar si el usuario esta autenticado con el token
        const token = req.headers.authorization?.split(' ')[1];  //obtener token 
        if (!token) {
            return res.status(403).json({ message: 'No autorizado' });
        }

        // Verificar token y tomar ID
        const decodedToken = jwt.verify(token, 'your_secret_key_here');
        const userId = decodedToken.userId;  // extraer userid

        // validar si se agregaron img
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No se han subido imágenes' });
        }

        //ruta imagenes
        const imagePaths = req.files.map(file => file.path);

        // crear nuevo reporte
        const newReport = new Report({
            category,
            description,
            province,
            canton,
            reportType,
            status: status || 'Pendiente', 
            images: imagePaths,
            userId,  
        });

        // guardar reporte
        await newReport.save();
        res.status(201).json(newReport);  
    } catch (error) {
        console.error('Error al crear el reporte:', error);
        res.status(500).json({ message: 'Error al crear el reporte', error });
    }
});

// actualizar reporte
router.put('/:id', async (req, res) => {
    try {
        const { assignedAdmin, status } = req.body;
        const reportId = req.params.id;

        const updatedReport = await Report.findByIdAndUpdate(
            reportId,
            { assignedAdmin, status },
            { new: true }
        );

        if (!updatedReport) {
            return res.status(404).json({ message: 'Reporte no encontrado' });
        }

        res.status(200).json(updatedReport);
    } catch (error) {
        console.error('Error al actualizar el reporte:', error);
        res.status(500).json({ message: 'Error al actualizar el reporte', error });
    }
});

//eliminar reporte
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    console.log('Eliminando reporte con ID:', id);  
    try {
      const deletedReport = await Report.findByIdAndDelete(id);
      if (!deletedReport) {
        console.log('No se encontró el reporte con ese ID');
        return res.status(404).json({ message: 'Reporte no encontrado' });
      }
      console.log('Reporte eliminado:', deletedReport);
      res.status(200).json({ message: 'Reporte eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar el reporte:', error);
      res.status(500).json({ message: 'Error al eliminar el reporte', error: error.message });
    }
  });
  

//obtener reportes del usuario logueado
router.get('/myreports', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];  // obtener el token 
        if (!token) {
            return res.status(403).json({ message: 'No autorizado' });
        }

        //verif token
        const decodedToken = jwt.verify(token, 'your_secret_key_here');
        const userId = decodedToken.userId;

        // buscar reportes del usuario logueado
        const reports = await Report.find({ userId }).populate('userId', 'firstName lastName email');
        res.status(200).json(reports);  
    } catch (error) {
        console.error('Error al obtener los reportes del usuario', error);
        res.status(500).json({ message: 'Error al obtener los reportes del usuario', error });
    }
});

module.exports = router;
