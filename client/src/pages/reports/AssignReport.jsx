import React, { useEffect, useState } from 'react';
import './AssignReport.css';
import { useNavigate } from 'react-router-dom';

const AssignReport = () => {
  const [reports, setReports] = useState([]);
  const [adminList, setAdminList] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedReport, setSelectedReport] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');


  //cargar datos
  useEffect(() => {
    const fetchReports = async () => {
      const response = await fetch('http://localhost:4000/api/reportes', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setReports(data);
    };

    const fetchAdmins = async () => {
      const response = await fetch('http://localhost:4000/api/admins', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setAdminList(data);
    };

    const fetchAssignments = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/assignments', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Error al obtener asignaciones');
        }

        const data = await response.json();
        setAssignments(data);
      } catch (error) {
        console.error('Error al obtener asignaciones:', error);
        alert('Hubo un problema al cargar las asignaciones.');
      }
    };

    if (token) {
      fetchReports();
      fetchAdmins();
      fetchAssignments();
    } else {
      navigate('/login');
    }
  }, [token, navigate]);


  //asignar reporte al admin
  const handleAssign = async () => {
    if (!selectedReport || !selectedAdmin) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/reportes/${selectedReport}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ assignedAdmin: selectedAdmin }),
      });

      if (response.ok) {
        alert('Reporte asignado correctamente.');
 
        const assignmentResponse = await fetch('http://localhost:4000/api/assignments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            reportId: selectedReport,
            userEmail: reports.find(report => report._id === selectedReport)?.userId?.email,
            reportDescription: reports.find(report => report._id === selectedReport)?.description,
            category: reports.find(report => report._id === selectedReport)?.category,
            status: 'Pendiente', // Estado inicial por defecto
            adminEmail: adminList.find(admin => admin._id === selectedAdmin)?.email,
            adminName: `${adminList.find(admin => admin._id === selectedAdmin)?.firstName} ${adminList.find(admin => admin._id === selectedAdmin)?.lastName}`,
            province: reports.find(report => report._id === selectedReport)?.province,
          }),
        });

        if (assignmentResponse.ok) {
          const assignmentData = await assignmentResponse.json();
          setAssignments(prevAssignments => [...prevAssignments, assignmentData]);
          setSelectedReport('');
          setSelectedAdmin('');
        } else {
          const assignmentError = await assignmentResponse.json();
          alert(`Error al guardar la asignación: ${assignmentError.message}`);
        }
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Error al asignar el reporte.'}`);
      }
    } catch (error) {
      console.error('Error de servidor:', error);
      alert('Error en la conexión con el servidor.');
    }
  };

  //cambiar estado de asignacion
  const handleChangeStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:4000/api/assignments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
  
      if (response.ok) {
        alert('Estado actualizado correctamente.');
        setAssignments(assignments.map(a => (a._id === id ? { ...a, status: newStatus } : a)));
      } else {
        const errorData = await response.json();
        alert(`Error al actualizar el estado: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error al cambiar el estado:', error);
      alert('Error al cambiar el estado.');
    }
  };
  
//eliminar asignacion
  const handleDeleteAssignment = async (assignmentId) => {
    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar esta asignación?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:4000/api/assignments/${assignmentId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
          alert('Asignación eliminada con éxito.');
          setAssignments(assignments.filter(assignment => assignment._id !== assignmentId));
        } else {
          const errorData = await response.json();
          alert(`Error al eliminar la asignación: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error al eliminar la asignación:', error);
        alert('Error al eliminar la asignación.');
      }
    }
  };

  //contenido
  return (
    <div className="assignReport">
      <h1>Asignar Reporte</h1>

      <div className="assignReport__form">
        <div>
          <select value={selectedReport} onChange={(e) => setSelectedReport(e.target.value)}>
            <option value="">Seleccionar Reporte</option>
            {reports.map(report => (
              <option key={report._id} value={report._id}>
                {report.description}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select value={selectedAdmin} onChange={(e) => setSelectedAdmin(e.target.value)}>
            <option value="">Seleccionar Administrador</option>
            {adminList.map(admin => (
              <option key={admin._id} value={admin._id}>
                {admin.firstName} {admin.lastName}
              </option>
            ))}
          </select>
        </div>

        <button onClick={handleAssign} className="assignReport__button">Asignar</button>
      </div>

      <table className="assignReport__table">
        <thead>
          <tr>
            <th>Correo del Usuario</th>
            <th>Descripción del Reporte</th>
            <th>Administrador</th>
            <th>Correo del Administrador</th>
            <th>Categoría</th>
            <th>Provincia</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map(assignment => (
            <tr key={assignment._id}>
              <td>{assignment.userEmail}</td>
              <td>{assignment.reportDescription}</td>
              <td>{assignment.adminName}</td>
              <td>{assignment.adminEmail}</td>
              <td>{assignment.category}</td>
              <td>{assignment.province}</td>
              <td>
                <select
                  value={assignment.status}
                  onChange={(e) => handleChangeStatus(assignment._id, e.target.value)}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En proceso">En proceso</option>
                  <option value="Resuelta">Resuelta</option>
                </select>
              </td>
              <td>
                <button
                  onClick={() => handleDeleteAssignment(assignment._id)}
                  className="assignReport__button bg-red-600"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignReport;
