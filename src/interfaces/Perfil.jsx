  // Perfil.jsx
  import React, { useState, useEffect } from 'react';
  import {
    User, Mail, GraduationCap, Calendar, Edit3, Camera, Settings, Book, Award
  } from 'lucide-react';
  import Header from './Header.jsx';
  import Footer from './Footer.jsx';
  import '../componentesCss/perfil.css';

  function Perfil() {
    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState('/api/placeholder/140/140'); // placeholder
    const [coverImage, setCoverImage] = useState('');
    const [activeTab, setActiveTab] = useState('publicaciones');
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusMsg, setStatusMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // Cargar datos del usuario al montar
    useEffect(() => {
      const sessionUser = (() => {
        try {
          return JSON.parse(sessionStorage.getItem('user'));
        } catch (e) {
          return null;
        }
      })();

      if (!sessionUser || !sessionUser.id_usuario) {
        setErrorMsg('No hay usuario logueado. Por favor inicia sesión.');
        setLoading(false);
        return;
      }

      const id = sessionUser.id_usuario;
      fetch(`http://localhost:5000/api/users/${id}`)
        .then(async (res) => {
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Error al obtener usuario');
          }
          return res.json();
        })
        .then(data => {
          // data tiene: id_usuario, nombre, apellido, email, direccion, telefono, tipo_usuario, fecha_creacion
          setUserInfo(data);
          // Si tuvieras foto en DB podrías setearla aquí:
          // setProfileImage(data.avatarUrl || profileImage);
        })
        .catch(err => setErrorMsg(err.message || 'Error cargando perfil'))
        .finally(() => setLoading(false));
    }, []);

    // Manejo de cambio de avatar (solo preview local)
    const handleProfileImageChange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setProfileImage(URL.createObjectURL(file));
      // Si deseas subirlo al servidor, implementa aquí la subida multipart/form-data
    };

    // Manejo de cambio de portada (solo preview local)
    const handleCoverImageChange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setCoverImage(URL.createObjectURL(file));
    };

    // Manejo de inputs (edición)
    const handleInputChange = (field, value) => {
      setUserInfo(prev => ({ ...prev, [field]: value }));
    };

    // Toggle editar / guardar
    const handleToggleEdit = async () => {
      setErrorMsg('');
      setStatusMsg('');

      if (!isEditing) {
        setIsEditing(true);
        return;
      }

      // Si estaba en modo edición y ahora clic en guardar
      // Validaciones básicas
      if (!userInfo.nombre || !userInfo.apellido || !userInfo.email) {
        setErrorMsg('Nombre, apellido y email son obligatorios.');
        return;
      }

      setStatusMsg('Guardando cambios...');
      try {
        const res = await fetch(`http://localhost:5000/api/users/${userInfo.id_usuario}`, {
          method: 'PUT', // Asegúrate de tener la ruta PUT en el backend
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: userInfo.nombre,
            apellido: userInfo.apellido,
            email: userInfo.email,
            direccion: userInfo.direccion,
            telefono: userInfo.telefono,
            tipo_usuario: userInfo.tipo_usuario
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Error al actualizar el perfil');
        }

        // Actualizar estado con la respuesta del servidor
        setUserInfo(data);

        // Actualizar sessionStorage (mantén id y demás si lo guardabas)
        try {
          const sessionStored = JSON.parse(sessionStorage.getItem('user')) || {};
          sessionStorage.setItem('user', JSON.stringify({
            ...sessionStored,
            id_usuario: data.id_usuario,
            nombre: data.nombre,
            apellido: data.apellido,
            email: data.email,
            direccion: data.direccion,
            telefono: data.telefono,
            tipo_usuario: data.tipo_usuario
          }));
        } catch (e) {
          // no bloquear en caso de error
          console.warn('No se pudo actualizar sessionStorage:', e);
        }

        setIsEditing(false);
        setStatusMsg('Perfil actualizado correctamente ✅');
      } catch (err) {
        setErrorMsg(err.message || 'Error actualizando perfil');
        setStatusMsg('');
      }
    };

    // Cambiar tab
    const handleTabChange = (tab) => setActiveTab(tab);

    if (loading) {
      return (
        <div className="app-container">
          <Header />
          <main className="main-content">
            <div className="perfil-container">
              <p>Cargando perfil...</p>
            </div>
          </main>
          <Footer />
        </div>
      );
    }

    if (errorMsg && !userInfo) {
      return (
        <div className="app-container">
          <Header />
          <main className="main-content">
            <div className="perfil-container">
              <p style={{ color: 'red' }}>{errorMsg}</p>
              <p>Si acabas de iniciar sesión y aún ves este mensaje, revisa que tu sesión esté guardada en <code>sessionStorage</code>.</p>
            </div>
          </main>
          <Footer />
        </div>
      );
    }

    // Formato "Miembro desde"
    const memberSince = userInfo?.fecha_creacion ? new Date(userInfo.fecha_creacion).toLocaleDateString() : '—';

    return (
      <div className="app-container">
        <Header />
        <main className="main-content">
          <div className="perfil-container">
            {/* Hero Section con Cover */}
            <div
              className="perfil-hero"
              style={{
                backgroundImage: coverImage
                  ? `url(${coverImage})`
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              <div className="cover-overlay"></div>
              <label className="cover-edit-btn" htmlFor="cover-upload">
                <Camera size={18} /> Cambiar portada
                <input id="cover-upload" type="file" accept="image/*" onChange={handleCoverImageChange} style={{ display: 'none' }} />
              </label>
            </div>

            {/* Avatar y Info Principal */}
            <div className="perfil-header">
              <div className="avatar-container">
                <div className="perfil-avatar">
                  <img src={profileImage} alt="Avatar del usuario" />
                  <label className="avatar-edit-btn" htmlFor="avatar-upload">
                    <Camera size={16} />
                    <input id="avatar-upload" type="file" accept="image/*" onChange={handleProfileImageChange} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              <div className="perfil-info">
                <div className="perfil-main-info">
                  {isEditing ? (
                    <div className="edit-form">
                      <div className="two-columns">
                        <input
                          type="text"
                          value={userInfo.nombre || ''}
                          onChange={(e) => handleInputChange('nombre', e.target.value)}
                          className="edit-input name-input"
                          placeholder="Nombre"
                        />
                        <input
                          type="text"
                          value={userInfo.apellido || ''}
                          onChange={(e) => handleInputChange('apellido', e.target.value)}
                          className="edit-input surname-input"
                          placeholder="Apellido"
                        />
                      </div>
                      <input
                        type="text"
                        value={userInfo.direccion || ''}
                        onChange={(e) => handleInputChange('direccion', e.target.value)}
                        className="edit-input title-input"
                        placeholder="Dirección"
                      />
                    </div>
                  ) : (
                    <>
                      <h1 className="perfil-nombre">{`${userInfo.nombre} ${userInfo.apellido}`}</h1>
                      <p className="perfil-titulo">{userInfo.tipo_usuario}</p>
                      <div className="perfil-ubicacion"><span>📍 {userInfo.direccion || 'No registrada'}</span></div>
                    </>
                  )}
                </div>

                <div className="perfil-acciones">
                  <button
                    className={`btn-primary ${isEditing ? 'saving' : ''}`}
                    onClick={handleToggleEdit}
                  >
                    <Edit3 size={18} />
                    {isEditing ? 'Guardar Cambios' : 'Editar Perfil'}
                  </button>
                  
                </div>
              </div>
            </div>

            {/* Contenido Principal */}
            <div className="perfil-content">
              <aside className="perfil-sidebar">
                <div className="info-card">
                  <h3 className="card-title"><User size={20} /> Información Personal</h3>
                  <div className="info-list">
                    <div className="info-item">
                      <Mail size={16} />
                      {isEditing ? (
                        <input
                          type="email"
                          value={userInfo.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
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
                          value={userInfo.tipo_usuario || ''}
                          onChange={(e) => handleInputChange('tipo_usuario', e.target.value)}
                          className="edit-input-small"
                        />
                      ) : (
                        <span>{userInfo.tipo_usuario}</span>
                      )}
                    </div>

                    <div className="info-item">
                      <Calendar size={16} />
                      <span>Miembro desde {memberSince}</span>
                    </div>

                    <div className="info-item">
                      <User size={16} />
                      {isEditing ? (
                        <input
                          type="text"
                          value={userInfo.telefono || ''}
                          onChange={(e) => handleInputChange('telefono', e.target.value)}
                          className="edit-input-small"
                          placeholder="Teléfono"
                        />
                      ) : (
                        <span>Tel: {userInfo.telefono || 'No registrado'}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="stats-card">
                  <h3 className="card-title"><Award size={20} /> Estadísticas</h3>
                  <div className="stats-grid">
                    <div className="stat-item"><span className="stat-number">12</span><span className="stat-label">Publicaciones</span></div>
                    <div className="stat-item"><span className="stat-number">48</span><span className="stat-label">Seguidores</span></div>
                    <div className="stat-item"><span className="stat-number">23</span><span className="stat-label">Siguiendo</span></div>
                    <div className="stat-item"><span className="stat-number">156</span><span className="stat-label">Me gusta</span></div>
                  </div>
                </div>

                
              </aside>

              <main className="perfil-main">
                <div className="posts-section">
                  

                  <div className="content-tabs">
                    <button className={`tab-btn ${activeTab === 'publicaciones' ? 'active' : ''}`} onClick={() => handleTabChange('publicaciones')}>Publicaciones</button>
                    
                  </div>

                  <div className="posts-container">
                    <div className="empty-state">
                      <div className="empty-icon">📝</div>
                      <h3>¡Comienza a compartir!</h3>
                      <p>Aún no tienes publicaciones. Comparte tus ideas, proyectos y experiencias con la comunidad.</p>
                      <button className="btn-primary">Crear primera publicación</button>
                    </div>
                  </div>

                </div>
              </main>
            </div>
          </div>

          {/* Mensajes */}
          <div style={{ padding: 12 }}>
            {statusMsg && <div style={{ color: 'green' }}>{statusMsg}</div>}
            {errorMsg && <div style={{ color: 'red' }}>{errorMsg}</div>}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  export default Perfil;
