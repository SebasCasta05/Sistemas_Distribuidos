import React, { useState } from 'react';
import '../componentesCss/muro.css';
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

const Muro = () => {
  const [currentCategory, setCurrentCategory] = useState('vivienda');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [imageViewer, setImageViewer] = useState({
    isOpen: false,
    images: [],
    currentIndex: 0
  });
  const [posts, setPosts] = useState([
    {
      id: 1,
      type: 'vivienda',
      title: 'Habitación cómoda cerca al campus ',
      price: '$450.000',
      description: 'Habitación individual con baño privado, internet incluido. Ambiente tranquilo para estudiar. A 10 minutos caminando de la universidad.',
      city: 'bogota',
      location: 'Barrio Centro',
      phone: '+57 319 447 7410',
      images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'],
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
      phone: '+57 310 209 6773',
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'],
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

  // Funciones de login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginData.email && loginData.password) {
      setIsLoggedIn(true);
      setShowLoginModal(false);
      setLoginData({ email: '', password: '' });
      alert('Login exitoso!');
    } else {
      alert('Por favor, completa todos los campos');
    }
  };

  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    alert('Sesión cerrada');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    Promise.all(files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    })).then(imageDataUrls => {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageDataUrls]
      }));
    }).catch(error => {
      console.error('Error al cargar imágenes:', error);
      alert('Error al cargar las imágenes');
    });
  };

  const removeImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
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
    const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
    
    let formattedPhone = cleanPhone;
    if (cleanPhone.startsWith('57')) {
      formattedPhone = cleanPhone;
    } else if (cleanPhone.startsWith('3')) {
      formattedPhone = '57' + cleanPhone;
    } else {
      formattedPhone = '57' + cleanPhone;
    }
    
    const message = encodeURIComponent('¡Hola! Me interesa tu publicación que vi en MyUniversity. ¿Podrías darme más información?');
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const openImageViewer = (images, startIndex = 0) => {
    setImageViewer({
      isOpen: true,
      images: images,
      currentIndex: startIndex
    });
  };

  const closeImageViewer = () => {
    setImageViewer({
      isOpen: false,
      images: [],
      currentIndex: 0
    });
  };

  const navigateImage = (direction) => {
    setImageViewer(prev => {
      const newIndex = direction === 'next' 
        ? (prev.currentIndex + 1) % prev.images.length
        : prev.currentIndex === 0 
          ? prev.images.length - 1 
          : prev.currentIndex - 1;
      
      return { ...prev, currentIndex: newIndex };
    });
  };

  return (
    <>
    <Header></Header>
    <div className="muro-container">
      <main className="muro-main">
        {/* Header del muro */}
        <div className="muro-header">
          <h1 className="muro-title">
            Muro de MyUniversity
          </h1>
          <p className="muro-subtitle">
            Encuentra viviendas y empleos para estudiantes
          </p>
        </div>

        {/* Botones de categorías */}
        <div className="category-buttons">
          <button 
            className={`category-button ${currentCategory === 'vivienda' ? 'active' : 'inactive'}`}
            onClick={() => handleCategoryChange('vivienda')}
          >
            🏠 Viviendas
          </button>
          
          <button 
            className="create-button"
            onClick={() => setShowCreateForm(true)}
          >
            ➕ Crear Publicación
          </button>
          
          <button 
            className={`category-button ${currentCategory === 'empleo' ? 'active' : 'inactive'}`}
            onClick={() => handleCategoryChange('empleo')}
          >
            💼 Empleos
          </button>
        </div>

        {/* Formulario de crear publicación */}
        {showCreateForm && (
          <div className="form-container">
            <div className="form-header">
              <h2 className="form-title">
                📝 Crear Nueva Publicación
              </h2>
              <button 
                className="close-button"
                onClick={() => setShowCreateForm(false)}
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

                  {/* Sección de carga de imágenes */}
                  <div className="image-upload">
                    <label className="form-label">Imágenes de la vivienda</label>
                    
                    <div 
                      className="image-drop-zone"
                      onClick={() => document.getElementById('imageInput').click()}
                    >
                      <div className="image-icon">📸</div>
                      <p>Haz clic para subir imágenes</p>
                      <input 
                        type="file" 
                        id="imageInput" 
                        multiple 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        className="hidden-input"
                      />
                    </div>

                    {/* Previsualización de imágenes cargadas */}
                    {formData.images.length > 0 && (
                      <div className="image-preview-grid">
                        {formData.images.map((image, index) => (
                          <div key={index} className="image-preview">
                            <img 
                              src={image} 
                              alt={`Preview ${index + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="image-remove"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
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
              >
                Publicar
              </button>
            </form>
          </div>
        )}

        {/* Posts container */}
        <div className="posts-grid">
          {filterPosts().map(post => (
            <div key={post.id} className="post-card">
              {post.type === 'vivienda' && post.images && post.images.length > 0 && (
                <div className="post-image-container">
                  <img 
                    src={post.images[0]} 
                    alt={post.title} 
                    className="post-image"
                    onClick={() => openImageViewer(post.images, 0)}
                  />
                  {post.images.length > 1 && (
                    <div 
                      className="post-image-count"
                      onClick={() => openImageViewer(post.images, 0)}
                    >
                      +{post.images.length - 1} más
                    </div>
                  )}
                </div>
              )}
              <div className="post-content">
                <span className={`post-category ${post.type}`}>
                  {post.type === 'vivienda' ? '🏠 Vivienda' : '💼 Empleo'}
                </span>
                <h3 className="post-title">
                  {post.title}
                </h3>
                <p className="post-description">
                  {post.description}
                </p>
                
                {post.type === 'empleo' && post.skills && (
                  <div className="post-skills">
                    <strong>Habilidades:</strong>
                    {(typeof post.skills === 'string' ? post.skills.split(',') : post.skills).map((skill, index) => (
                      <span 
                        key={index} 
                        className="skill-tag"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="post-info">
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
                  className="contact-button"
                  onClick={() => handleContact(post.phone)}
                >
                  📞 Contactar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Visor de imágenes en pantalla completa */}
        {imageViewer.isOpen && (
          <div className="image-viewer">
            <button
              onClick={closeImageViewer}
              className="viewer-close"
            >
              ×
            </button>

            {imageViewer.images.length > 1 && (
              <button
                onClick={() => navigateImage('prev')}
                className="viewer-nav prev"
              >
                ←
              </button>
            )}

            {imageViewer.images.length > 1 && (
              <button
                onClick={() => navigateImage('next')}
                className="viewer-nav next"
              >
                →
              </button>
            )}

            <div className="viewer-image-container">
              <img
                src={imageViewer.images[imageViewer.currentIndex]}
                alt={`Imagen ${imageViewer.currentIndex + 1}`}
                className="viewer-image"
              />
              
              {imageViewer.images.length > 1 && (
                <div className="viewer-counter">
                  {imageViewer.currentIndex + 1} de {imageViewer.images.length}
                </div>
              )}
            </div>

            {imageViewer.images.length > 1 && (
              <div className="viewer-thumbnails">
                {imageViewer.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Miniatura ${index + 1}`}
                    className={`thumbnail ${index === imageViewer.currentIndex ? 'active' : ''}`}
                    onClick={() => setImageViewer(prev => ({ ...prev, currentIndex: index }))}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal de Login */}
        {showLoginModal && (
          <div className="modal">
            <div className="modal-content">
              <button
                onClick={() => setShowLoginModal(false)}
                className="modal-close"
              >
                ×
              </button>

              <div className="modal-header">
                <h2 className="modal-title">
                  Iniciar Sesión
                </h2>
                <p className="modal-subtitle">
                  Accede a tu cuenta de MyUniversity
                </p>
              </div>

              <form onSubmit={handleLoginSubmit}>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginInputChange}
                    className="form-input"
                    placeholder="tu@email.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginInputChange}
                    className="form-input"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="modal-button-primary"
                >
                  Iniciar Sesión
                </button>

                <div className="modal-text-center">
                  <p className="modal-text">
                    ¿No tienes una cuenta?
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLoginModal(false);
                      // navigate('/register'); - Descomenta si usas React Router
                    }}
                    className="modal-link"
                  >
                    Regístrate aquí
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
    <Footer></Footer>
     </>
  );
};

export default Muro;