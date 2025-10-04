import React, { useState } from "react";

const PostForm = ({ onSubmit, onClose, loading }) => {
  const [formData, setFormData] = useState({
    type: 'vivienda',
    title: '',
    price: '',
    salary: '',
    description: '',
    city: '',
    location: '',
    phone: '',
    company: '',
    skills: '',
    workMode: '',
    studies: '',
    imageUrl: ''
  });

  const cities = [
    { value: 'bogota', label: 'Bogotá' },
    { value: 'barranquilla', label: 'Barranquilla' },
    { value: 'medellin', label: 'Medellín' },
    { value: 'cartagena', label: 'Cartagena' },
    { value: 'cali', label: 'Cali' }
  ];

  const workModes = [
    { value: 'presencial', label: 'Presencial' },
    { value: 'remoto', label: 'Remoto' },
    { value: 'hibrido', label: 'Híbrido' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2 className="form-title">
          📝 Crear Nueva Publicación
        </h2>
        <button 
          className="close-button"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Tipo de publicación */}
        <div className="form-group">
          <label className="form-label">Tipo de Publicación</label>
          <select 
            className="form-select"
            name="type" 
            value={formData.type}
            onChange={handleInputChange}
            required
          >
            <option value="vivienda">🏠 Vivienda</option>
            <option value="empleo">💼 Empleo</option>
          </select>
        </div>

        {/* Título */}
        <div className="form-group">
          <label className="form-label">Título</label>
          <input 
            type="text" 
            className="form-input"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder={formData.type === 'vivienda' ? 'Ej: Habitación cerca al campus' : 'Ej: Desarrollador Frontend Junior'} 
            required 
          />
        </div>

        {/* Campos específicos por tipo */}
        {formData.type === 'vivienda' ? (
          <>
            <div className="form-grid">
              <div>
                <label className="form-label">Precio/mes (solo números)</label>
                <input 
                  type="text" 
                  className="form-input"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="500000" 
                  required 
                />
                <small style={{fontSize: '11px', color: '#666'}}>Sin puntos, comas ni símbolos. Ej: 500000</small>
              </div>
              <div>
                <label className="form-label">Ciudad</label>
                <select 
                  className="form-select"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecciona una ciudad</option>
                  {cities.map(city => (
                    <option key={city.value} value={city.value}>
                      {city.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-grid form-grid-full">
              <div>
                <label className="form-label">Ubicación específica</label>
                <input 
                  type="text" 
                  className="form-input"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Barrio, dirección aproximada" 
                  required 
                />
              </div>
              <div>
                <label className="form-label">Teléfono de contacto</label>
                <input 
                  type="tel" 
                  className="form-input"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+57 300 123 4567" 
                  required 
                />
              </div>
            </div>

            {/* Sección de URL de imagen */}
            <div className="form-group">
              <label className="form-label">URL de la imagen</label>
              <input 
                type="url" 
                className="form-input"
                name="imageUrl"
                value={formData.imageUrl || ''}
                onChange={handleInputChange}
                placeholder="https://ejemplo.com/imagen.jpg" 
              />
              <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                💡 Recomendación: Sube tu imagen en <a href="https://postimages.org/" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline' }}>Postimages</a> y copia aquí la URL "Enlace directo"
              </p>
            </div>
          </>
        ) : (
          // Campos para empleo
          <>
            <div className="form-grid">
              <div>
                <label className="form-label">Salario por hora</label>
                <input 
                  type="text" 
                  className="form-input"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  placeholder="$20.000/hora" 
                  required 
                />
              </div>
              <div>
                <label className="form-label">Nombre de la empresa</label>
                <input 
                  type="text" 
                  className="form-input"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Ej: TechStart" 
                  required 
                />
              </div>
            </div>

            <div className="form-grid form-grid-full">
              <div>
                <label className="form-label">Modalidad de trabajo</label>
                <select 
                  className="form-select"
                  name="workMode"
                  value={formData.workMode}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecciona modalidad</option>
                  {workModes.map(mode => (
                    <option key={mode.value} value={mode.value}>
                      {mode.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Teléfono de contacto</label>
                <input 
                  type="tel" 
                  className="form-input"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+57 300 123 4567" 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Habilidades mínimas (separadas por comas)</label>
              <input 
                type="text" 
                className="form-input"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="React, JavaScript, CSS, HTML" 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">¿Qué debe estudiar o áreas afines?</label>
              <input 
                type="text" 
                className="form-input"
                name="studies"
                value={formData.studies}
                onChange={handleInputChange}
                placeholder="Ingeniería de Sistemas, Desarrollo de Software o afín" 
                required 
              />
            </div>
          </>
        )}

        {/* Descripción */}
        <div className="form-group">
          <label className="form-label">Descripción</label>
          <textarea 
            className="form-textarea"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe los detalles de tu publicación..." 
            required
          />
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Publicando...' : 'Publicar'}
        </button>
      </form>
    </div>
  );
};

export default PostForm;