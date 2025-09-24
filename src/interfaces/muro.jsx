import React, { useState } from 'react';

const Muro = () => {
  const [currentCategory, setCurrentCategory] = useState('vivienda');
  const [showCreateForm, setShowCreateForm] = useState(false);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función mejorada para manejar la carga de imágenes
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Convertir archivos a base64 para almacenamiento
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

  // Función para eliminar una imagen del formulario
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
    // Limpiar el número de teléfono (eliminar espacios, guiones, paréntesis)
    const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
    
    // Asegurarse de que el número tenga el código de país de Colombia (+57)
    let formattedPhone = cleanPhone;
    if (cleanPhone.startsWith('57')) {
      formattedPhone = cleanPhone;
    } else if (cleanPhone.startsWith('3')) {
      formattedPhone = '57' + cleanPhone;
    } else {
      formattedPhone = '57' + cleanPhone;
    }
    
    // Mensaje predeterminado
    const message = encodeURIComponent('¡Hola! Me interesa tu publicación que vi en MyUniversity. ¿Podrías darme más información?');
    
    // URL de WhatsApp
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${message}`;
    
    // Abrir en nueva pestaña
    window.open(whatsappUrl, '_blank');
  };

  // Función para abrir el visor de imágenes
  const openImageViewer = (images, startIndex = 0) => {
    setImageViewer({
      isOpen: true,
      images: images,
      currentIndex: startIndex
    });
  };

  // Función para cerrar el visor de imágenes
  const closeImageViewer = () => {
    setImageViewer({
      isOpen: false,
      images: [],
      currentIndex: 0
    });
  };

  // Función para navegar entre imágenes
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
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      margin: 0,
      padding: 0
    }}>
      {/* Header */}
      <header style={{
        background: '#2196f3',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '28px', fontWeight: '900' }}>MyUniversity</span>
        </div>
        <nav style={{ flex: 2, display: 'flex', justifyContent: 'center', gap: '40px' }}>
          <a href="#" style={{
            color: 'white',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '6px',
            transition: 'all 0.2s ease'
          }}>🏠 Inicio</a>
          <a href="#" style={{
            color: 'white',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '6px',
            transition: 'all 0.2s ease'
          }}>🧱 Muro</a>
        </nav>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <button style={{
            background: '#f9a825',
            border: 'none',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '800',
            fontSize: '16px',
            transition: 'all 0.3s ease'
          }}>👤 Login</button>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        {/* Header del muro */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#2c3e50', fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
            Muro de MyUniversity
          </h1>
          <p style={{ color: '#7f8c8d', fontSize: '18px' }}>
            Encuentra viviendas y empleos para estudiantes
          </p>
        </div>

        {/* Botones de categorías */}
        <div style={{
          display: 'flex',
          gap: '30px',
          marginBottom: '40px',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <button 
            style={{
              padding: '12px 30px',
              border: '2px solid #3498db',
              background: currentCategory === 'vivienda' ? '#3498db' : 'transparent',
              color: currentCategory === 'vivienda' ? 'white' : '#3498db',
              borderRadius: '25px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s',
              transform: currentCategory === 'vivienda' ? 'translateY(-2px)' : 'none',
              boxShadow: currentCategory === 'vivienda' ? '0 5px 15px rgba(52, 152, 219, 0.4)' : 'none'
            }}
            onClick={() => handleCategoryChange('vivienda')}
          >
            🏠 Viviendas
          </button>
          
          <button 
            style={{
              background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '25px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onClick={() => setShowCreateForm(true)}
          >
            ➕ Crear Publicación
          </button>
          
          <button 
            style={{
              padding: '12px 30px',
              border: '2px solid #3498db',
              background: currentCategory === 'empleo' ? '#3498db' : 'transparent',
              color: currentCategory === 'empleo' ? 'white' : '#3498db',
              borderRadius: '25px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s',
              transform: currentCategory === 'empleo' ? 'translateY(-2px)' : 'none',
              boxShadow: currentCategory === 'empleo' ? '0 5px 15px rgba(52, 152, 219, 0.4)' : 'none'
            }}
            onClick={() => handleCategoryChange('empleo')}
          >
            💼 Empleos
          </button>
        </div>

        {/* Formulario de crear publicación */}
        {showCreateForm && (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
            marginBottom: '30px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ color: '#2c3e50', fontSize: '20px', fontWeight: '600' }}>
                📝 Crear Nueva Publicación
              </h2>
              <button 
                style={{
                  background: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
                onClick={() => setShowCreateForm(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Tipo de publicación */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  color: '#34495e',
                  fontWeight: '500',
                  marginBottom: '8px'
                }}>Tipo de Publicación</label>
                <select 
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid #ecf0f1',
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
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
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  color: '#34495e',
                  fontWeight: '500',
                  marginBottom: '8px'
                }}>Título</label>
                <input 
                  type="text" 
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid #ecf0f1',
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
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
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        color: '#34495e',
                        fontWeight: '500',
                        marginBottom: '8px'
                      }}>Precio/mes</label>
                      <input 
                        type="text" 
                        style={{
                          width: '100%',
                          padding: '12px 15px',
                          border: '2px solid #ecf0f1',
                          borderRadius: '8px',
                          fontSize: '16px',
                          boxSizing: 'border-box'
                        }}
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="$500.000" 
                        required 
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        color: '#34495e',
                        fontWeight: '500',
                        marginBottom: '8px'
                      }}>Ciudad</label>
                      <select 
                        style={{
                          width: '100%',
                          padding: '12px 15px',
                          border: '2px solid #ecf0f1',
                          borderRadius: '8px',
                          fontSize: '16px',
                          boxSizing: 'border-box'
                        }}
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

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        color: '#34495e',
                        fontWeight: '500',
                        marginBottom: '8px'
                      }}>Ubicación específica</label>
                      <input 
                        type="text" 
                        style={{
                          width: '100%',
                          padding: '12px 15px',
                          border: '2px solid #ecf0f1',
                          borderRadius: '8px',
                          fontSize: '16px',
                          boxSizing: 'border-box'
                        }}
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Barrio, dirección aproximada" 
                        required 
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        color: '#34495e',
                        fontWeight: '500',
                        marginBottom: '8px'
                      }}>Teléfono de contacto</label>
                      <input 
                        type="tel" 
                        style={{
                          width: '100%',
                          padding: '12px 15px',
                          border: '2px solid #ecf0f1',
                          borderRadius: '8px',
                          fontSize: '16px',
                          boxSizing: 'border-box'
                        }}
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+57 300 123 4567" 
                        required 
                      />
                    </div>
                  </div>

                  {/* Sección mejorada de carga de imágenes */}
                  <div style={{ marginTop: '20px' }}>
                    <label style={{
                      display: 'block',
                      color: '#34495e',
                      fontWeight: '500',
                      marginBottom: '8px'
                    }}>Imágenes de la vivienda</label>
                    
                    <div 
                      style={{
                        border: '2px dashed #bdc3c7',
                        borderRadius: '8px',
                        padding: '30px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        backgroundColor: '#f8f9fa'
                      }}
                      onClick={() => document.getElementById('imageInput').click()}
                    >
                      <div style={{ fontSize: '48px', marginBottom: '10px' }}>📸</div>
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

                    {/* Previsualización de imágenes cargadas */}
                    {formData.images.length > 0 && (
                      <div style={{
                        marginTop: '15px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                        gap: '10px'
                      }}>
                        {formData.images.map((image, index) => (
                          <div key={index} style={{ position: 'relative' }}>
                            <img 
                              src={image} 
                              alt={`Preview ${index + 1}`}
                              style={{
                                width: '100%',
                                height: '120px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '2px solid #ecf0f1'
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              style={{
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                                background: '#e74c3c',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '25px',
                                height: '25px',
                                cursor: 'pointer',
                                fontSize: '14px'
                              }}
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
                // Campos para empleo (simplificado para el ejemplo)
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        color: '#34495e',
                        fontWeight: '500',
                        marginBottom: '8px'
                      }}>Salario por hora</label>
                      <input 
                        type="text" 
                        style={{
                          width: '100%',
                          padding: '12px 15px',
                          border: '2px solid #ecf0f1',
                          borderRadius: '8px',
                          fontSize: '16px',
                          boxSizing: 'border-box'
                        }}
                        name="salary"
                        value={formData.salary}
                        onChange={handleInputChange}
                        placeholder="$20.000/hora" 
                        required 
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        color: '#34495e',
                        fontWeight: '500',
                        marginBottom: '8px'
                      }}>Nombre de la empresa</label>
                      <input 
                        type="text" 
                        style={{
                          width: '100%',
                          padding: '12px 15px',
                          border: '2px solid #ecf0f1',
                          borderRadius: '8px',
                          fontSize: '16px',
                          boxSizing: 'border-box'
                        }}
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Ej: TechStart" 
                        required 
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        color: '#34495e',
                        fontWeight: '500',
                        marginBottom: '8px'
                      }}>Modalidad de trabajo</label>
                      <select 
                        style={{
                          width: '100%',
                          padding: '12px 15px',
                          border: '2px solid #ecf0f1',
                          borderRadius: '8px',
                          fontSize: '16px',
                          boxSizing: 'border-box'
                        }}
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
                      <label style={{
                        display: 'block',
                        color: '#34495e',
                        fontWeight: '500',
                        marginBottom: '8px'
                      }}>Teléfono de contacto</label>
                      <input 
                        type="tel" 
                        style={{
                          width: '100%',
                          padding: '12px 15px',
                          border: '2px solid #ecf0f1',
                          borderRadius: '8px',
                          fontSize: '16px',
                          boxSizing: 'border-box'
                        }}
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+57 300 123 4567" 
                        required 
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '20px' }}>
                    <label style={{
                      display: 'block',
                      color: '#34495e',
                      fontWeight: '500',
                      marginBottom: '8px'
                    }}>Habilidades mínimas (separadas por comas)</label>
                    <input 
                      type="text" 
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '2px solid #ecf0f1',
                        borderRadius: '8px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                      }}
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      placeholder="React, JavaScript, CSS, HTML" 
                      required 
                    />
                  </div>

                  <div style={{ marginTop: '20px' }}>
                    <label style={{
                      display: 'block',
                      color: '#34495e',
                      fontWeight: '500',
                      marginBottom: '8px'
                    }}>¿Qué debe estudiar o áreas afines?</label>
                    <input 
                      type="text" 
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '2px solid #ecf0f1',
                        borderRadius: '8px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                      }}
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
              <div style={{ marginTop: '20px' }}>
                <label style={{
                  display: 'block',
                  color: '#34495e',
                  fontWeight: '500',
                  marginBottom: '8px'
                }}>Descripción</label>
                <textarea 
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid #ecf0f1',
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    minHeight: '100px',
                    resize: 'vertical'
                  }}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe los detalles de tu publicación..." 
                  required
                />
              </div>

              <button 
                type="submit" 
                style={{
                  background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '15px 40px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginTop: '20px'
                }}
              >
                Publicar
              </button>
            </form>
          </div>
        )}

        {/* Posts container */}
        <div style={{ display: 'grid', gap: '20px' }}>
          {filterPosts().map(post => (
            <div key={post.id} style={{
              background: 'white',
              borderRadius: '15px',
              overflow: 'hidden',
              boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
            }}>
              {post.type === 'vivienda' && post.images && post.images.length > 0 && (
                <div style={{ position: 'relative' }}>
                  <img 
                    src={post.images[0]} 
                    alt={post.title} 
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      cursor: 'pointer'
                    }}
                    onClick={() => openImageViewer(post.images, 0)}
                  />
                  {post.images.length > 1 && (
                    <div 
                      style={{
                        position: 'absolute',
                        bottom: '10px',
                        right: '10px',
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '15px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                      onClick={() => openImageViewer(post.images, 0)}
                    >
                      +{post.images.length - 1} más
                    </div>
                  )}
                </div>
              )}
              <div style={{ padding: '20px' }}>
                <span style={{
                  display: 'inline-block',
                  background: post.type === 'empleo' ? '#e74c3c' : '#3498db',
                  color: 'white',
                  padding: '5px 12px',
                  borderRadius: '15px',
                  fontSize: '12px',
                  fontWeight: '500',
                  marginBottom: '10px'
                }}>
                  {post.type === 'vivienda' ? '🏠 Vivienda' : '💼 Empleo'}
                </span>
                <h3 style={{
                  color: '#2c3e50',
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '10px'
                }}>
                  {post.title}
                </h3>
                <p style={{
                  color: '#7f8c8d',
                  lineHeight: '1.6',
                  marginBottom: '15px'
                }}>
                  {post.description}
                </p>
                
                {post.type === 'empleo' && post.skills && (
                  <div style={{ margin: '10px 0' }}>
                    <strong>Habilidades:</strong>
                    {(typeof post.skills === 'string' ? post.skills.split(',') : post.skills).map((skill, index) => (
                      <span 
                        key={index} 
                        style={{
                          display: 'inline-block',
                          background: '#f39c12',
                          color: 'white',
                          padding: '3px 8px',
                          borderRadius: '10px',
                          fontSize: '12px',
                          margin: '2px'
                        }}
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}
                
                <div style={{
                  display: 'flex',
                  gap: '20px',
                  fontSize: '14px',
                  color: '#95a5a6',
                  flexWrap: 'wrap',
                  marginBottom: '15px'
                }}>
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
                  style={{
                    background: '#3498db',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
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
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Botón cerrar */}
            <button
              onClick={closeImageViewer}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                fontSize: '30px',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
            >
              ×
            </button>

            {/* Botón anterior */}
            {imageViewer.images.length > 1 && (
              <button
                onClick={() => navigateImage('prev')}
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: 'white',
                  fontSize: '24px',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease'
                }}
              >
                ←
              </button>
            )}

            {/* Botón siguiente */}
            {imageViewer.images.length > 1 && (
              <button
                onClick={() => navigateImage('next')}
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: 'white',
                  fontSize: '24px',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease'
                }}
              >
                →
              </button>
            )}

            {/* Imagen principal */}
            <div style={{ maxWidth: '90%', maxHeight: '90%', position: 'relative' }}>
              <img
                src={imageViewer.images[imageViewer.currentIndex]}
                alt={`Imagen ${imageViewer.currentIndex + 1}`}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
                }}
              />
              
              {/* Indicador de posición */}
              {imageViewer.images.length > 1 && (
                <div style={{
                  position: 'absolute',
                  bottom: '-40px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: 'white',
                  background: 'rgba(0, 0, 0, 0.5)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  backdropFilter: 'blur(10px)'
                }}>
                  {imageViewer.currentIndex + 1} de {imageViewer.images.length}
                </div>
              )}
            </div>

            {/* Miniaturas navegables */}
            {imageViewer.images.length > 1 && (
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '10px',
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '10px',
                borderRadius: '20px',
                backdropFilter: 'blur(10px)'
              }}>
                {imageViewer.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Miniatura ${index + 1}`}
                    style={{
                      width: '60px',
                      height: '40px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      border: index === imageViewer.currentIndex ? '2px solid white' : '2px solid transparent',
                      opacity: index === imageViewer.currentIndex ? 1 : 0.7,
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => setImageViewer(prev => ({ ...prev, currentIndex: index }))}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <footer style={{
        background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
        color: 'white',
        textAlign: 'center',
        padding: '20px',
        marginTop: '50px'
      }}>
        <p>© 2025 Mi página</p>
      </footer>
    </div>
  );
};

export default Muro;