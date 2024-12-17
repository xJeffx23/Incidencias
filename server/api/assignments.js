const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assigments');
const transporter = require('../config/nodemailerConfig'); 

//crear asignacion
router.post('/', async (req, res) => {
  console.log('Datos recibidos para asignación:', req.body);

  try {
    const assignment = new Assignment(req.body);
    await assignment.save();

    res.status(201).json({
      reportId: assignment.reportId,
      userEmail: assignment.userEmail,
      reportDescription: assignment.reportDescription,
      category: assignment.category,
      status: assignment.status,
      adminEmail: assignment.adminEmail,
      adminName: assignment.adminName,
      province: assignment.province,
      assignedAt: assignment.assignedAt,
    });
  } catch (error) {
    console.error('Error al guardar la asignación:', error);
    res.status(500).json({ message: 'Error al crear la asignación', error });
  }
});

//actualizar estado
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedAssignment) {
      return res.status(404).json({ message: 'Asignación no encontrada.' });
    }

//enviar correo al usuario del reporte
    const { userEmail, reportDescription, adminName } = updatedAssignment;
    const subject =
      status === 'En proceso'
        ? 'Tu reporte está en proceso de revisión'
        : 'Tu reporte ha sido resuelto';

        const text =
        status === 'En proceso'
          ? `Hola, tu reporte "${reportDescription}" está siendo revisado por ${adminName}.`
          : `Hola, tu reporte "${reportDescription}" ha sido resuelto.`;
    

          try {
            console.log('Datos del correo:', {
              from: 'incidencias.cr.2024@gmail.com',
              to: userEmail,
              subject,
              text,
            });
          
            await transporter.sendMail({
              from: 'incidencias.cr.2024@gmail.com',
              to: userEmail,
              subject,
              text,
            });
            console.log('Correo enviado exitosamente.');
          } catch (emailError) {
            console.error('Error al enviar el correo:', emailError);
            return res.status(500).json({ message: 'Error al enviar el correo', emailError });
          }
          

    res.status(200).json(updatedAssignment);
  } catch (error) {
    console.error('Error al actualizar la asignación:', error);
    res.status(500).json({ message: 'Error al actualizar la asignación' });
  }
});

//eliminar asignacion
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAssignment = await Assignment.findByIdAndDelete(id);
    if (!deletedAssignment) {
      return res.status(404).json({ message: 'Asignación no encontrada.' });
    }
    res.status(200).json({ message: 'Asignación eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar la asignación:', error);
    res.status(500).json({ message: 'Error al eliminar la asignación', error });
  }
});

//obtener todas las asignaciones
router.get('/', async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.status(200).json(assignments);
  } catch (error) {
    console.error('Error al obtener las asignaciones:', error);
    res.status(500).json({ message: 'Error al obtener las asignaciones' });
  }
});

module.exports = router;
