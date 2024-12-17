import React, { useEffect, useState } from 'react';
import './VisReport.css'; 
import { Link } from "react-router-dom"; 
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // tablas pdf
import Papa from 'papaparse'; // exportar csv

const VisReport = () => {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    province: '',
  });

  const [provincesData] = useState({
    'San José': ['Central', 'Escazú', 'Desamparados', 'Puriscal', 'Tarrazú'],
    'Alajuela': ['San Ramón', 'Grecia', 'Naranjo'],
    'Cartago': ['Central', 'Paraíso', 'La Unión'],
    'Heredia': ['Barva', 'Santo Domingo', 'Santa Bárbara'],
    'Guanacaste': ['Liberia', 'Nicoya', 'Santa Cruz'],
    'Puntarenas': ['Central', 'Esparza', 'Buenos Aires'],
    'Limón': ['Central', 'Talamanca', 'Pococí'],
  });

  useEffect(() => {
    const fetchReports = async () => {
      const query = new URLSearchParams(filters).toString();
      const response = await fetch(`http://localhost:4000/api/reportes?${query}`);
      const data = await response.json();
      setReports(data);
    };
    fetchReports();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };


  //logica para exportar pdf
  const handleExportPDF = () => {
    const doc = new jsPDF('landscape'); 
  
//titulo
    doc.setFontSize(18);
    doc.text("Reporte de Incidencias", 14, 15);
  
//columnas
    const tableColumnHeaders = [
      'Categoría', 'Provincia', 'Cantón', 'Descripción',
      'Estado', 'Nombre', 'Apellido', 'Email', 'Fecha'
    ];
  
    const tableData = reports.map(report => [
      report.category || 'N/A',
      report.province || 'N/A',
      report.canton || 'N/A',
      report.description || 'N/A',
      report.status || 'N/A',
      report.userId?.firstName || 'Desconocido',
      report.userId?.lastName || 'Desconocido',
      report.userId?.email || 'Desconocido',
      new Date(report.createdAt).toLocaleString() || 'N/A'
    ]);
  

    doc.autoTable({
      head: [tableColumnHeaders],
      body: tableData,
      startY: 25,
      margin: { top: 20, left: 10, right: 10 },
      styles: {
        fontSize: 9,
        cellPadding: 2, //celdas espacio
        overflow: 'linebreak', 
      },
      columnStyles: {
        3: { cellWidth: 70 }, //ancho desc
        7: { cellWidth: 50 }, //ancho mail
      },
      headStyles: {
        fillColor: [0, 121, 107],
        textColor: 255,
        halign: 'center',
        fontStyle: 'bold',
      },
      bodyStyles: {
        textColor: 50,
      },
      alternateRowStyles: { fillColor: [240, 240, 240] }, 
      didDrawPage: (data) => {
        //numeracion pag
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(
          `Página ${data.pageNumber} de ${pageCount}`,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      },
    });
  
    doc.save("reporte_incidencias.pdf");
  };
  
  //logica exportar csv
  const handleExportCSV = () => {
    const csvData = reports.map(report => ({
      Categoría: report.category,
      Provincia: report.province,
      Cantón: report.canton,
      Descripción: report.description,
      Estado: report.status,
      Nombre: report.userId ? report.userId.firstName : 'Desconocido',
      Apellido: report.userId ? report.userId.lastName : 'Desconocido',
      Email: report.userId ? report.userId.email : 'Desconocido',
      Fecha: new Date(report.createdAt).toLocaleString()
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'reporte_incidencias.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  //borrar filtros
  const handleClearFilters = () => {
    setFilters({
      status: '',
      category: '',
      province: '',
    });
  };

  //eliminar reporte
  const handleDeleteReport = async (reportId) => {
    console.log('Eliminando reporte con ID:', reportId);  
    const confirmation = window.confirm("¿Estás seguro de que deseas eliminar este reporte?");
    if (confirmation) {
      try {
        const response = await fetch(`http://localhost:4000/api/reportes/${reportId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setReports((prevReports) => prevReports.filter((report) => report._id !== reportId));
        } else {
          const errorResponse = await response.json();
          alert(`Error: ${errorResponse.message}`);
          console.log('Error:', errorResponse);
        }
      } catch (error) {
        console.error("Error de red:", error);
      }
    }
  };
  

  //contenido
  return (
    <div className="visreport-mainContent">
      <h1 className="visreport-h1">Todos los reportes</h1>

      <div className="filters">
        <select name="status" value={filters.status} onChange={handleFilterChange} className="visreport-select">
          <option value="">Filtrar por estado</option>
          <option value="Pendiente">Pendiente</option>
          <option value="En proceso">En proceso</option>
          <option value="Resuelta">Resuelta</option>
        </select>

        <select name="category" value={filters.category} onChange={handleFilterChange} className="visreport-select">
          <option value="">Filtrar por categoría</option>
          <option value="infraestructura">Infraestructura</option>
          <option value="seguridad">Seguridad</option>
          <option value="medio_ambiente">Medio Ambiente</option>
          <option value="salud_publica">Salud Pública</option>
        </select>

        <select name="province" value={filters.province} onChange={handleFilterChange} className="visreport-select">
          <option value="">Filtrar por provincia</option>
          {Object.keys(provincesData).map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>

        <button className="visreport-button bg-blue-600" onClick={handleClearFilters}>
          Borrar Filtros
        </button>
      </div>

      <div className="export-buttons">
        <button onClick={handleExportPDF} className="visreport-button bg-green-600">
          Exportar PDF
        </button>
        <button onClick={handleExportCSV} className="visreport-button bg-orange-600">
          Exportar CSV
        </button>
      </div>

      <table className="visreport-table">
  <thead>
    <tr>
      <th className="visreport-th">Categoría</th>
      <th className="visreport-th">Provincia</th>
      <th className="visreport-th">Cantón</th>
      <th className="visreport-th">Descripción</th>
      <th className="visreport-th">Tipo</th>
      <th className="visreport-th">Nombre</th>
      <th className="visreport-th">Apellido</th>
      <th className="visreport-th">Email</th>
      <th className="visreport-th">Estado</th>
      <th className="visreport-th">Fecha y Hora</th>
      <th className="visreport-th">Acciones</th>
    </tr>
  </thead>
  <tbody>
    {reports.map((report) => (
      <tr key={report._id} className="visreport-tr">
        <td className="visreport-td">{report.category.charAt(0).toUpperCase() + report.category.slice(1)}</td>
        <td className="visreport-td">{report.province}</td>
        <td className="visreport-td">{report.canton}</td>
        <td className="visreport-td">{report.description}</td>
        <td className="visreport-td">{report.reportType}</td>
        <td className="visreport-td">{report.userId ? report.userId.firstName : 'Desconocido'}</td>
        <td className="visreport-td">{report.userId ? report.userId.lastName : 'Desconocido'}</td>
        <td className="visreport-td">{report.userId ? report.userId.email : 'Desconocido'}</td>
        <td className="visreport-td">{report.status}</td>
        <td className="visreport-td">{new Date(report.createdAt).toLocaleString()}</td>
        <td className="visreport-td">
          <button onClick={() => handleDeleteReport(report._id)} className="visreport-button bg-red-600">
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

export default VisReport;
