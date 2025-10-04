import React, { useState, useEffect } from 'react';
import '../componentesCss/muro.css';
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

const API_URL = "http://localhost:5000/api/publicaciones";

const Muro = () => {
  const [currentCategory, setCurrentCategory] = useState('vivienda');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [imageViewer, setImageViewer] = useState({
    isOpen: false,
    images: [],
    currentIndex: 0
  });
  const [posts, setPosts] = useState([]);

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

  // Cargar publicaciones desde la base de datos al montar el componente y al cambiar de categoría
  useEffect(() => {
    fetchPosts();
  }, [currentCategory]);

  // Función para cargar las publicaciones desde la base de datos
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const endpoint = currentCategory === 'vivienda' ? 'viviendas' : 'empleos';
      const response = await fetch(`${API_URL}/${endpoint}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar publicaciones');
      }
      
      const data = await response.json();
      
      // Transformar datos de la BD al formato del componente
      const transformedPosts = data.map(item => {
        if (currentCategory === 'vivienda') {
          return {
            id: item.idpublicacionvivienda,
            type: 'vivienda',
            title: item.nombre,
            price: `$${parseFloat(item.precio).toLocaleString('es-CO')}`,
            description: item.descripcion,
            city: item.ciudad,
            location: item.ubicacion,
            phone: item.telefono,
            images: item.img ? [item.img] : [],
            timestamp: formatTimestamp(item.created_at)
          };
        } else {
          return {
            id: item.idpublicacionempleo,
            type: 'empleo',
            title: item.nombre,
            salary: item.salario,
            company: item.empresa,
            skills: item.habilidades_minimas ? item.habilidades_minimas.split(',') : [],
            workMode: item.modalidad,
            studies: item.estudios,
            description: item.descripcion,
            phone: item.telefono,
            timestamp: formatTimestamp(item.created_at)
          };
        }
      });
      
      setPosts(transformedPosts);
    } catch (error) {
      console.error('Error al cargar publicaciones:', error);
      alert('Error al cargar las publicaciones. Verifica que el servidor esté funcionando.');
    } finally {
      setLoading(false);
    }
  };

  // Función para formatear el timestamp
  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const postDate = new Date(timestamp);
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'unos momentos';
    if (diffMins < 60) return `${diffMins} minutos`;
    if (diffHours < 24) return `${diffHours} horas`;
    if (diffDays === 1) return '1 día';
    return `${diffDays} días`;
  };

  // Funciones de login (puedes conectarlas a tu API de usuarios después)
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

  // Función para enviar el formulario y crear la publicación
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = formData.type === 'vivienda' ? 'viviendas' : 'empleos';
      
      let body;
      if (formData.type === 'vivienda') {
        // Convertir precio a número (eliminar $ y comas)
        const priceNumber = parseFloat(formData.price.replace(/[$.,\s]/g, ''));
        
        if (isNaN(priceNumber)) {
          alert('Por favor ingresa un precio válido (solo números)');
          setLoading(false);
          return;
        }
        
        body = {
          nombre: formData.title,
          precio: priceNumber,
          ciudad: formData.city,
          ubicacion: formData.location,
          telefono: formData.phone,
          img: formData.imageUrl || '',
          descripcion: formData.description
        };
      } else {
        body = {
          nombre: formData.title,
          salario: formData.salary,
          empresa: formData.company,
          modalidad: formData.workMode,
          telefono: formData.phone,
          habilidades_minimas: formData.skills,
          estudios: formData.studies,
          descripcion: formData.description
        };
      }

      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear publicación');
      }

      const newPost = await response.json();
      alert('¡Publicación creada exitosamente!');
      
      // Resetear formulario
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
        imageUrl: ''
      });
      
      setShowCreateForm(false);
      
      // Recargar publicaciones para mostrar la nueva
      await fetchPosts();
      
    } catch (error) {
      console.error('Error:', error);
      alert(`Error al crear la publicación: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    return posts;
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
            disabled={loading}
          >
            🏠 Viviendas
          </button>
          
          <button 
            className="create-button"
            onClick={() => setShowCreateForm(true)}
            disabled={loading}
          >
            ➕ Crear Publicación
          </button>
          
          <button 
            className={`category-button ${currentCategory === 'empleo' ? 'active' : 'inactive'}`}
            onClick={() => handleCategoryChange('empleo')}
            disabled={loading}
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
        )}

        {/* Indicador de carga */}
        {loading && !showCreateForm && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ fontSize: '18px', color: '#666' }}>Cargando publicaciones...</p>
          </div>
        )}

        {/* Mensaje si no hay publicaciones */}
        {!loading && posts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ fontSize: '18px', color: '#666' }}>
              No hay publicaciones de {currentCategory === 'vivienda' ? 'viviendas' : 'empleos'} aún.
            </p>
            <p style={{ fontSize: '14px', color: '#999', marginTop: '10px' }}>
              ¡Sé el primero en publicar!
            </p>
          </div>
        )}

        {/* Posts container */}
        <div className="posts-grid">
          {filterPosts().map(post => (
            <div key={post.id} className="post-card">
              {post.type === 'vivienda' && post.images && post.images.length > 0 && post.images[0] && (
                <div className="post-image-container">
                  <img 
                    src={post.images[0]} 
                    alt={post.title} 
                    className="post-image"
                    onClick={() => openImageViewer(post.images, 0)}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
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
                
                {post.type === 'empleo' && post.skills && post.skills.length > 0 && (
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