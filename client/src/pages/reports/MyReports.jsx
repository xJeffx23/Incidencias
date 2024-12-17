import React, { useEffect, useState } from 'react';
import './MyReports.css';

const MyReports = () => {
  const [reports, setReports] = useState([]);

  //obtener los reportes
  useEffect(() => {
    const fetchMyReports = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No se encontró el token de autenticación.");
          return;
        }
        //token de autenticacion al endpoint
        const response = await fetch('http://localhost:4000/api/reportes/myreports', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los reportes');
        }

        const data = await response.json();
        setReports(data);

      } catch (error) {
        console.error('Error al cargar reportes:', error);
      }
    };

    fetchMyReports();
  }, []);

  //contenido
  return (
    <div className="myreports-mainContent">
      <h1 className="myreports-h1">Mis Reportes</h1>

      <div className="myreports-cards-container">
        {reports.length > 0 ? (
          reports.map((report) => (
            <div className="myreports-report-card" key={report._id}>
              <div className="myreports-report-card-header">
                <span className="myreports-category">{report.category}</span>
                <span className="myreports-report-type">{report.reportType}</span>
              </div>
              <div className="myreports-report-card-body">
                <p><strong>Provincia:</strong> {report.province}</p>
                <p><strong>Cantón:</strong> {report.canton}</p>
                <p><strong>Descripción:</strong> {report.description}</p>
              </div>
              <div className="myreports-report-card-footer">
                <p><strong>Fecha:</strong> {new Date(report.createdAt).toLocaleString()}</p>
                <p className={`myreports-status-${report.status.toLowerCase()}`}>{report.status}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No tienes reportes creados.</p>
        )}
      </div>
    </div>
  );
};

export default MyReports;
