import React, { useState } from 'react';
import "../componentesCss/muro.css"; // Aquí estarán los estilos en CSS

const Muro = () => {
  const [currentCategory, setCurrentCategory] = useState('vivienda');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [posts, setPosts] = useState([
    {
      id: 1,
      type: 'vivienda',
      title: 'Habitación cómoda cerca al campus',
      price: '$450.000',
      description: 'Habitación individual con baño privado, internet incluido. Ambiente tranquilo para estudiar. A 10 minutos caminando de la universidad.',
      city: 'bogota',
      location: 'Barrio Centro',
      phone: '+57 300 123 4567',
      images: ['https://via.placeholder.com/400x200?text=Habitación+Disponible'],
      timestamp: '2 horas'
    },
    {
      id: 2,
      type: 'empleo',
      title: 'Desarrollador Frontend Junior',
      salary: '$25.000/hora',
      company: 'TechStart',
      skills: ['React', 'JavaScript', 'CSS'],
      workMode: 'hibrido',
      studies: 'Ingeniería de Sistemas o afín',
      description: 'Buscamos estudiante de últimos semestres para desarrollo de interfaces web. Experiencia con React y JavaScript.',
      phone: '+57 300 987 6543',
      timestamp: '1 día'
    },
    {
      id: 3,
      type: 'vivienda',
      title: 'Apartaestudio amoblado',
      price: '$650.000',
      description: 'Apartaestudio completamente amoblado, cocina equipada, zona de lavandería. Ideal para estudiantes responsables.',
      city: 'medellin',
      location: 'Barrio Universidad',
      phone: '+57 300 111 2222',
      images: ['https://via.placeholder.com/400x200?text=Apartaestudio'],
      timestamp: '3 horas'
    }
  ]);

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
    images: []
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: imageUrls
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newPost = {
      id: Date.now(),
      ...formData,
      timestamp: 'Hace unos momentos'
    };

    setPosts(prev => [newPost, ...prev]);
    
    setFormData({
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
      images: []
    });
    
    setShowCreateForm(false);
    alert('¡Publicación creada exitosamente!');
  };

  const filterPosts = () => {
    return posts.filter(post => post.type === currentCategory);
  };

  const handleCategoryChange = (category) => {
    setCurrentCategory(category);
    setFormData(prev => ({ ...prev, type: category }));
  };

  const handleContact = (phone) => {
    alert(`Contactar por WhatsApp: ${phone}`);
  };

  return (
    <div className="body">
        <header className="header">
            <div className="header__left">
                <span className="header__logo">MyUniversity</span>
            </div>
            <nav className="header__nav">
                <a href="#" className="header__link">🏠 Inicio</a>
                <a href="#" className="header__link">🧱 Muro</a>
            </nav>
            <div className="header__right">
                <button className="header__login">👤 Login</button>
            </div>
        </header>


      <main className="main-container">
        <div className="wall-header">
          <h1 className="wall-title">Muro de MyUniversity</h1>
          <p className="wall-subtitle">Encuentra viviendas y empleos para estudiantes</p>
        </div>

        <div className="post-categories">
          <button 
            className={`category-btn ${currentCategory === 'vivienda' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('vivienda')}
          >
            🏠 Viviendas
          </button>
          
          <button 
            className="create-post-btn"
            onClick={() => setShowCreateForm(true)}
          >
            ➕ Crear Publicación
          </button>
          
          <button 
            className={`category-btn ${currentCategory === 'empleo' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('empleo')}
          >
            💼 Empleos
          </button>
        </div>

        {showCreateForm && (
          <div className="create-post-section">
            <div className="create-post-header">
              <h2 className="create-post-title">📝 Crear Nueva Publicación</h2>
              <button 
                className="close-btn"
                onClick={() => setShowCreateForm(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Tipo de Publicación</label>
                <select 
                  className="form-input"
                  name="type" 
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="vivienda">🏠 Vivienda</option>
                  <option value="empleo">💼 Empleo</option>
                </select>
              </div>

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

              {formData.type === 'vivienda' ? (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Precio/mes</label>
                      <input 
                        type="text" 
                        className="form-input"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="$500.000" 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Ciudad</label>
                      <select 
                        className="form-input"
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

                  <div className="form-row">
                    <div className="form-group">
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
                    <div className="form-group">
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
                    <label className="form-label">Imágenes de la vivienda</label>
                    <div className="image-upload" onClick={() => document.getElementById('imageInput').click()}>
                      <div className="image-icon">📸</div>
                      <p>Haz clic para subir imágenes</p>
                      <input 
                        type="file" 
                        id="imageInput" 
                        multiple 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        style={{ display: 'none' }} 
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-row">
                    <div className="form-group">
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
                    <div className="form-group">
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

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Modalidad de trabajo</label>
                      <select 
                        className="form-input"
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
                    <div className="form-group">
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

              <button type="submit" className="publish-btn">Publicar</button>
            </form>
          </div>
        )}

        <div className="posts-container">
          {filterPosts().map(post => (
            <div key={post.id} className="post-card">
              {post.type === 'vivienda' && post.images && post.images.length > 0 && (
                <img src={post.images[0]} alt={post.title} className="post-image" />
              )}
              <div className="post-content">
                <span className={`post-category ${post.type === 'empleo' ? 'empleo' : ''}`}>
                  {post.type === 'vivienda' ? '🏠 Vivienda' : '💼 Empleo'}
                </span>
                <h3 className="post-title">{post.title}</h3>
                <p className="post-description">{post.description}</p>
                
                {post.type === 'empleo' && post.skills && (
                  <div className="post-skills">
                    <strong>Habilidades:</strong>
                    {(typeof post.skills === 'string' ? post.skills.split(',') : post.skills).map((skill, index) => (
                      <span key={index} className="skill-tag">{skill.trim()}</span>
                    ))}
                  </div>
                )}
                
                <div className="post-details">
                  {post.type === 'vivienda' ? (
                    <>
                      <span>💰 {post.price}/mes</span>
                      <span>📍 {post.location}</span>
                      <span>🏙️ {cities.find(c => c.value === post.city)?.label || post.city}</span>
                    </>
                  ) : (
                    <>
                      <span>💰 {post.salary}</span>
                      <span>🏢 {post.company}</span>
                      <span>💻 {workModes.find(w => w.value === post.workMode)?.label || post.workMode}</span>
                      {post.studies && <span>🎓 {post.studies}</span>}
                    </>
                  )}
                  <span>⏰ Hace {post.timestamp}</span>
                </div>
                <button 
                  className="contact-btn"
                  onClick={() => handleContact(post.phone)}
                >
                  📞 Contactar
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="footer">
        <p>© 2025 Mi página</p>
      </footer>
    </div>
  );
};

export default Muro;
