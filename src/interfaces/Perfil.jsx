import React, { useState } from 'react';
import { User, Mail, GraduationCap, Calendar, Edit3, Camera, Settings, Book, Award } from 'lucide-react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import '../componentesCss/perfil.css';

function Perfil() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState('/api/placeholder/140/140');
  const [coverImage, setCoverImage] = useState('');
  const [activeTab, setActiveTab] = useState('publicaciones');
  
  // Estados para información editable
  const [userInfo, setUserInfo] = useState({
    name: 'Juan Pérez',
    title: 'Estudiante de Ingeniería de Sistemas',
    email: 'juan.perez@email.com',
    career: 'Ingeniería de Sistemas',
    memberSince: 'Enero 2024',
    location: 'Bogotá, Colombia',
    bio: 'Estudiante apasionado por la tecnología y el desarrollo de software. Me encanta aprender nuevas tecnologías y compartir conocimientos con la comunidad.'
  });

  // Función para cambiar foto de perfil
  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      // Aquí irías la lógica para subir la imagen al servidor
      console.log('Imagen de perfil seleccionada:', file);
    }
  };

  // Función para cambiar portada
  const handleCoverImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCoverImage(imageUrl);
      // Aquí irías la lógica para subir la imagen al servidor
      console.log('Imagen de portada seleccionada:', file);
    }
  };

  // Función para editar perfil
  const handleEditProfile = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Aquí harías la petición para guardar los cambios
      console.log('Guardando cambios del perfil:', userInfo);
      alert('Perfil actualizado correctamente');
    }
  };

  // Función para cambiar de tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    console.log('Cambiando a tab:', tab);
  };

  // Función para crear nueva publicación
  const handleCreatePost = () => {
    console.log('Creando nueva publicación...');
    // Aquí irías la lógica para abrir modal de crear publicación
    alert('Funcionalidad de crear publicación - Por implementar');
  };

  // Función para manejar acciones de publicaciones
  const handlePostAction = (action, postId) => {
    console.log(`Acción: ${action} en publicación: ${postId}`);
    // Aquí manejarías like, comentar, compartir, etc.
  };

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div className="perfil-container">
          {/* Hero Section con Cover */}
          <div className="perfil-hero">
            <div 
              className="perfil-cover"
              style={{
                backgroundImage: coverImage 
                  ? `url(${coverImage})` 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="cover-overlay"></div>
              <label className="cover-edit-btn" htmlFor="cover-upload">
                <Camera size={18} />
                Cambiar portada
                <input
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            
            {/* Avatar y Info Principal */}
            <div className="perfil-header">
              <div className="avatar-container">
                <div className="perfil-avatar">
                  <img 
                    src={profileImage}
                    alt="Avatar del usuario"
                  />
                  <label className="avatar-edit-btn" htmlFor="avatar-upload">
                    <Camera size={16} />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
              
              <div className="perfil-info">
                <div className="perfil-main-info">
                  {isEditing ? (
                    <div className="edit-form">
                      <input 
                        type="text"
                        value={userInfo.name}
                        onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                        className="edit-input name-input"
                      />
                      <input 
                        type="text"
                        value={userInfo.title}
                        onChange={(e) => setUserInfo({...userInfo, title: e.target.value})}
                        className="edit-input title-input"
                      />
                      <input 
                        type="text"
                        value={userInfo.location}
                        onChange={(e) => setUserInfo({...userInfo, location: e.target.value})}
                        className="edit-input location-input"
                      />
                    </div>
                  ) : (
                    <>
                      <h1 className="perfil-nombre">{userInfo.name}</h1>
                      <p className="perfil-titulo">{userInfo.title}</p>
                      <div className="perfil-ubicacion">
                        <span>📍 {userInfo.location}</span>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="perfil-acciones">
                  <button 
                    className={`btn-primary ${isEditing ? 'saving' : ''}`}
                    onClick={handleEditProfile}
                  >
                    <Edit3 size={18} />
                    {isEditing ? 'Guardar Cambios' : 'Editar Perfil'}
                  </button>
                  <button className="btn-secondary">
                    <Settings size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="perfil-content">
            {/* Sidebar con información */}
            <aside className="perfil-sidebar">
              <div className="info-card">
                <h3 className="card-title">
                  <User size={20} />
                  Información Personal
                </h3>
                <div className="info-list">
                  <div className="info-item">
                    <Mail size={16} />
                    {isEditing ? (
                      <input 
                        type="email"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                        className="edit-input-small"
                      />
                    ) : (
                      <span>{userInfo.email}</span>
                    )}
                  </div>
                  <div className="info-item">
                    <GraduationCap size={16} />
                    {isEditing ? (
                      <input 
                        type="text"
                        value={userInfo.career}
                        onChange={(e) => setUserInfo({...userInfo, career: e.target.value})}
                        className="edit-input-small"
                      />
                    ) : (
                      <span>{userInfo.career}</span>
                    )}
                  </div>
                  <div className="info-item">
                    <Calendar size={16} />
                    <span>Miembro desde {userInfo.memberSince}</span>
                  </div>
                </div>
              </div>

              <div className="stats-card">
                <h3 className="card-title">
                  <Award size={20} />
                  Estadísticas
                </h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-number">12</span>
                    <span className="stat-label">Publicaciones</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">48</span>
                    <span className="stat-label">Seguidores</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">23</span>
                    <span className="stat-label">Siguiendo</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">156</span>
                    <span className="stat-label">Me gusta</span>
                  </div>
                </div>
              </div>

              <div className="bio-card">
                <h3 className="card-title">Acerca de mí</h3>
                {isEditing ? (
                  <textarea 
                    value={userInfo.bio}
                    onChange={(e) => setUserInfo({...userInfo, bio: e.target.value})}
                    className="bio-textarea"
                    rows="4"
                  />
                ) : (
                  <p className="bio-text">{userInfo.bio}</p>
                )}
              </div>
            </aside>

            {/* Contenido principal - Publicaciones */}
            <main className="perfil-main">
              <div className="posts-section">
                <div className="section-header">
                  <h3 className="section-title">
                    <Book size={20} />
                    Mis Publicaciones
                  </h3>
                  <button 
                    className="btn-outline"
                    onClick={() => console.log('Ver todas las publicaciones')}
                  >
                    Ver todas
                  </button>
                </div>

                {/* Tabs para diferentes tipos de contenido */}
                <div className="content-tabs">
                  <button 
                    className={`tab-btn ${activeTab === 'publicaciones' ? 'active' : ''}`}
                    onClick={() => handleTabChange('publicaciones')}
                  >
                    Publicaciones
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'proyectos' ? 'active' : ''}`}
                    onClick={() => handleTabChange('proyectos')}
                  >
                    Proyectos
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'guardados' ? 'active' : ''}`}
                    onClick={() => handleTabChange('guardados')}
                  >
                    Guardados
                  </button>
                </div>

                {/* Lista de publicaciones mejorada */}
                <div className="posts-container">
                  {/* Publicación de ejemplo */}
                  <article className="post-card">
                    <div className="post-header">
                      <div className="post-avatar">
                        <img src="/api/placeholder/40/40" alt="Juan" />
                      </div>
                      <div className="post-meta">
                        <h4 className="post-author">Juan Pérez</h4>
                        <span className="post-date">Hace 2 días</span>
                      </div>
                      <button className="post-menu">⋯</button>
                    </div>
                    <div className="post-content">
                      <h3 className="post-title">Mi primer proyecto en React</h3>
                      <p className="post-text">
                        Acabo de terminar mi primera aplicación en React. Fue un desafío 
                        increíble y aprendí mucho sobre componentes y estado...
                      </p>
                      <div className="post-tags">
                        <span className="tag">#React</span>
                        <span className="tag">#JavaScript</span>
                        <span className="tag">#WebDev</span>
                      </div>
                    </div>
                    <div className="post-actions">
                      <button 
                        className="action-btn"
                        onClick={() => handlePostAction('like', 1)}
                      >
                        <span>❤️</span> 12
                      </button>
                      <button 
                        className="action-btn"
                        onClick={() => handlePostAction('comment', 1)}
                      >
                        <span>💬</span> 5
                      </button>
                      <button 
                        className="action-btn"
                        onClick={() => handlePostAction('share', 1)}
                      >
                        <span>🔄</span> 2
                      </button>
                    </div>
                  </article>

                  {/* Estado vacío mejorado */}
                  <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <h3>¡Comienza a compartir!</h3>
                    <p>Aún no tienes publicaciones. Comparte tus ideas, proyectos y experiencias con la comunidad.</p>
                    <button 
                      className="btn-primary"
                      onClick={handleCreatePost}
                    >
                      Crear primera publicación
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}



export default Perfil;