import React, { useState } from 'react';
import './CreateReport.css';


//estado inicial del formulario
const CreateReport = () => {
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    province: '',
    canton: '',
    reportType: '', 
    images: [],
  });

  //data de provincias 
  //nota: mover data a assets
  const [provincesData] = useState({
    'San José': ['Central', 'Escazú', 'Desamparados', 'Puriscal', 'Tarrazú', 'Aserrí', 'Alajuelita', 'Vázquez de Coronado', 'Acosta', 'Montaño', 'Tibás', 'Moravia', 'Goicoechea', 'Santa Ana', 'Zarcero', 'Valverde Vega', 'Alajuelita'],
    'Alajuela': ['Central', 'San Ramón', 'Grecia', 'Naranjo', 'Atenas', 'Palmares', 'Orotina', 'San Carlos', 'Guatuso', 'Upala', 'Los Chiles', 'La Fortuna', 'Río Cuarto', 'Cañas'],
    'Cartago': ['Central', 'Paraíso', 'La Unión', 'Jiménez', 'Turrialba', 'Alvarado', 'Oreamuno', 'El Guarco'],
    'Heredia': ['Central', 'Barva', 'Santo Domingo', 'Santa Bárbara', 'San Rafael', 'San Isidro', 'Belén', 'Flores', 'San Pablo'],
    'Guanacaste': ['Liberia', 'Nicoya', 'Santa Cruz', 'Bagaces', 'Carrillo', 'Cañas', 'Abangares', 'Tilarán', 'La Cruz', 'Hojancha'],
    'Puntarenas': ['Central', 'Esparza', 'Buenos Aires', 'Montes de Oro', 'Osa', 'Quepos', 'Parrita', 'Golfito', 'Coto Brus', 'Corredores', 'La Unidad', 'Manuel Antonio'],
    'Limón': ['Central', 'Talamanca', 'Pococí', 'Siquirres', 'Matina', 'Guácimo']
  });

//manejar los cambios de los campos de entrada
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
        ...prevData,
        [name]: value,
    }));
  };

  //seleccion de img
  const handleFileChange = (e) => {
    setFormData({
        ...formData,
        images: Array.from(e.target.files),
    });
  };

  //envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(); //objeto fd para enviar los datos
    form.append('category', formData.category);
    form.append('description', formData.description);
    form.append('province', formData.province);
    form.append('canton', formData.canton);
    form.append('reportType', formData.reportType);
    formData.images.forEach((file) => {
        form.append('images', file);
    });

    const token = localStorage.getItem('token');   //token autenticacion usuario para el reporte

    try {
        const response = await fetch('http://localhost:4000/api/reportes', {
            method: 'POST',
            body: form,
            headers: {
                Authorization: `Bearer ${token}`,  
            },
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        const data = await response.json(); //respuesta a json
        alert('Reporte creado exitosamente');
        setFormData({
            category: '',
            description: '',
            province: '',
            canton: '',
            reportType: '',
            images: [],
        });
    } catch (error) {
        console.error('Error al crear el reporte:', error);
        alert('Hubo un error al enviar el reporte');
    }
  };

  return (
    <div className="create-report-container">
        <h2 className="form-title">Crear Reporte</h2>
        <form onSubmit={handleSubmit} className="report-form">
            <div className="form-group">
                <label htmlFor="category">Categoría</label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Selecciona una categoría</option>
                    <option value="infraestructura">Infraestructura</option>
                    <option value="seguridad">Seguridad</option>
                    <option value="medio_ambiente">Medio Ambiente</option>
                    <option value="salud_publica">Salud Pública</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="reportType">Tipo de Reporte</label>
                <select
                    id="reportType"
                    name="reportType"
                    value={formData.reportType}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Selecciona un tipo de reporte</option>
                    <option value="Problema">Problema</option>
                    <option value="Sugerencia">Sugerencia</option>
                    <option value="Comentario">Comentario</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="description">Descripción</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="province">Provincia</label>
                <select
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Seleccione una provincia</option>
                    {Object.keys(provincesData).map((province) => (
                        <option key={province} value={province}>
                            {province}
                        </option>
                    ))}
                </select>
            </div>

            {formData.province && (
                <div className="form-group">
                    <label htmlFor="canton">Cantón</label>
                    <select
                        id="canton"
                        name="canton"
                        value={formData.canton}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Seleccione un cantón</option>
                        {provincesData[formData.province].map((canton) => (
                            <option key={canton} value={canton}>
                                {canton}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="form-group">
                <label htmlFor="images">Adjuntar imágenes</label>
                <input
                    type="file"
                    id="images"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                />
            </div>

            <button type="submit" className="submit-btn">
                Enviar Reporte
            </button>
        </form>
    </div>
  );
};

export default CreateReport;
