import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User, Mail, GraduationCap, Calendar, Award, Eye, UserCheck, UserPlus
} from 'lucide-react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import "../componentesCss/Perfil.css";

function PerfilPublico() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [siguiendo, setSiguiendo] = useState(false);
  const [cargandoSeguimiento, setCargandoSeguimiento] = useState(false);
  const [estadisticas, setEstadisticas] = useState({ seguidores: 0, seguidos: 0 });

  // 🔹 Cargar usuario actual desde sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setCurrentUser(userData);
      } catch (error) {
        console.error("❌ Error parseando usuario:", error);
      }
    }
  }, []);

  // 🔹 Cargar perfil público, publicaciones y estado de seguimiento
  useEffect(() => {
    const loadPublicProfile = async () => {
      setLoading(true);
      setErrorMsg('');

      if (!id) {
        setErrorMsg('ID de usuario no válido');
        setLoading(false);
        return;
      }

      try {
        // Cargar datos del usuario
        const userRes = await fetch(`http://localhost:5000/api/users/${id}`);
        if (!userRes.ok) {
          const errBody = await userRes.json().catch(() => ({}));
          throw new Error(errBody.message || 'Error al obtener usuario');
        }
        const userData = await userRes.json();
        
        const normalizedUser = {
          ...userData,
          email: userData.email || userData.correo || userData.mail || userData.email_usuario,
          id_usuario: userData.id_usuario || userData.id || userData.user_id,
        };
        setUserInfo(normalizedUser);

        // Cargar publicaciones del usuario
        const pubsRes = await fetch(`http://localhost:5000/api/publicaciones/usuario/${id}`);
        if (!pubsRes.ok) throw new Error('Error al obtener publicaciones');
        const pubsData = await pubsRes.json();

        // CORRECCIÓN: Verificar que pubsData sea un array antes de mapear
        const normalizedPubs = (Array.isArray(pubsData) ? pubsData : []).map((item) => {
          // Verificar que item existe y tiene propiedades
          if (!item) {
            return {
              id_publicacion: Date.now() + Math.random(), // ID temporal
              titulo: 'Publicación no disponible',
              descripcion: '',
              tipo_publicacion: '',
              detalle_1: '',
              detalle_2: '',
              created_at: null,
              autor_nombre: '',
              autor_apellido: '',
            };
          }

          const id_pub =
            item.id_publicacion ||
            item.id_publicacionvivienda ||
            item.id_publicacionempleo ||
            item.id ||
            Date.now() + Math.random(); // ID temporal como fallback

          const tipo =
            item.tipo_publicacion ||
            item.tipo ||
            (item.precio !== undefined ? 'vivienda' : item.empresa ? 'empleo' : '');

          const detalle1 = item.detalle_1 || item.ciudad || item.empresa || '';
          const detalle2 =
            item.detalle_2 ||
            (item.precio !== undefined ? String(item.precio) : (item.salario !== undefined ? String(item.salario) : ''));

          const createdAt = item.created_at || item.createdAt || item.fecha_creacion || item.fecha || null;

          return {
            id_publicacion: id_pub,
            titulo: item.titulo || item.nombre || item.name || 'Sin título',
            descripcion: item.descripcion || item.body || '',
            tipo_publicacion: tipo,
            detalle_1: detalle1,
            detalle_2: detalle2,
            created_at: createdAt,
            autor_nombre: item.autor_nombre || item.nombre_autor || item.nombre || '',
            autor_apellido: item.autor_apellido || item.apellido_autor || item.apellido || '',
          };
        });

        setPublicaciones(normalizedPubs);

        // Cargar estadísticas de seguidores
        const statsRes = await fetch(`http://localhost:5000/api/users/${id}/estadisticas-seguidores`);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setEstadisticas(statsData);
        }

        // Verificar si el usuario actual sigue a este usuario
        if (currentUser) {
          const seguimientoRes = await fetch(
            `http://localhost:5000/api/users/seguimiento/${currentUser.id_usuario}/${id}`
          );
          if (seguimientoRes.ok) {
            const seguimientoData = await seguimientoRes.json();
            setSiguiendo(seguimientoData.siguiendo);
          }
        }

      } catch (err) {
        console.error('Error cargando perfil público:', err);
        setErrorMsg(err.message || 'Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    loadPublicProfile();
  }, [id, currentUser]);

  // 🔹 Manejar seguir/dejar de seguir
  const manejarSeguimiento = async () => {
    if (!currentUser) {
      alert('Debes iniciar sesión para seguir usuarios');
      return;
    }

    setCargandoSeguimiento(true);
    setErrorMsg('');

    try {
      const endpoint = siguiendo ? 'dejar-seguir' : 'seguir';
      const res = await fetch(`http://localhost:5000/api/users/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_seguidor: currentUser.id_usuario,
          id_seguido: id
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al actualizar seguimiento');
      }

      setSiguiendo(!siguiendo);
      
      // Actualizar contador de seguidores
      const statsRes = await fetch(`http://localhost:5000/api/users/${id}/estadisticas-seguidores`);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setEstadisticas(statsData);
      }

    } catch (err) {
      console.error('Error en seguimiento:', err);
      setErrorMsg(err.message);
    } finally {
      setCargandoSeguimiento(false);
    }
  };

  // 🔹 Función para ver imagen en modal
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  const handleViewImage = (imageUrl, isProfile = true) => {
    setCurrentImage({
      url: imageUrl,
      type: isProfile ? 'Perfil' : 'Portada'
    });
    setShowImageModal(true);
  };

  const handleCloseModal = () => {
    setShowImageModal(false);
    setCurrentImage('');
  };

  // 🔹 Función para redirigir al perfil propio si es el mismo usuario
  const handleGoToOwnProfile = () => {
    navigate('/perfil');
  };

  // 🔹 Formatear fecha
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString();
  };

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
            <p>El perfil solicitado no existe o no está disponible.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const memberSince = userInfo?.fecha_creacion ? formatDate(userInfo.fecha_creacion) : 
                     (userInfo?.fechaCreacion ? formatDate(userInfo.fechaCreacion) : '—');

  // Verificar si el perfil visto es del usuario actual
  const isOwnProfile = currentUser && userInfo && currentUser.id_usuario === userInfo.id_usuario;

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div className="perfil-container">
          {/* Header del Perfil */}
          <div className="perfil-header">
            <div className="avatar-container">
              <div className="perfil-avatar">
                <img 
                  src={userInfo?.imagen_url || userInfo?.profile_image || '/api/placeholder/140/140'} 
                  alt="Avatar" 
                  onClick={() => handleViewImage(userInfo?.imagen_url || userInfo?.profile_image, true)}
                  style={{ cursor: userInfo?.imagen_url ? 'pointer' : 'default' }}
                />
              </div>
            </div>

            <div className="perfil-info">
              <div className="perfil-main-info">
                <h1 className="perfil-nombre">{`${userInfo?.nombre || ''} ${userInfo?.apellido || ''}`}</h1>
                <p className="perfil-titulo">{userInfo?.tipo_usuario_descripcion || userInfo?.tipo_usuario || 'Usuario'}</p>
                <div className="perfil-ubicacion">
                  <span>📍 {userInfo?.direccion || 'Ubicación no especificada'}</span>
                </div>
                
                {/* Indicador de perfil propio */}
                {isOwnProfile && (
                  <div className="own-profile-badge">
                    👋 Este es tu perfil
                  </div>
                )}
              </div>

              <div className="perfil-acciones">
                {isOwnProfile ? (
                  <button 
                    className="btn-primary" 
                    onClick={handleGoToOwnProfile}
                  >
                    Editar Mi Perfil
                  </button>
                ) : (
                  <button 
                    className={`btn-seguir ${siguiendo ? 'siguiendo' : ''}`}
                    onClick={manejarSeguimiento}
                    disabled={cargandoSeguimiento || !currentUser}
                  >
                    {cargandoSeguimiento ? (
                      'Cargando...'
                    ) : siguiendo ? (
                      <>
                        <UserCheck size={18} />
                        Siguiendo
                      </>
                    ) : (
                      <>
                        <UserPlus size={18} />
                        Seguir
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Contenido del Perfil */}
          <div className="perfil-content">
            <aside className="perfil-sidebar">
              {/* Información Personal */}
              <div className="info-card">
                <h3 className="card-title"><User size={20} /> Información Personal</h3>
                <div className="info-list">
                  <div className="info-item">
                    <Mail size={16} /> 
                    <span>{userInfo?.email || 'Email no disponible'}</span>
                  </div>
                  <div className="info-item">
                    <GraduationCap size={16} /> 
                    <span>{userInfo?.tipo_usuario_descripcion || userInfo?.tipo_usuario || 'No especificado'}</span>
                  </div>
                  <div className="info-item">
                    <Calendar size={16} /> 
                    <span>Miembro desde {memberSince}</span>
                  </div>
                  <div className="info-item">
                    <User size={16} /> 
                    <span>Tel: {userInfo?.telefono || 'No registrado'}</span>
                  </div>
                </div>
              </div>

              {/* Estadísticas */}
              <div className="stats-card">
                <h3 className="card-title"><Award size={20} /> Estadísticas</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-number">{publicaciones.length}</span>
                    <span className="stat-label">Publicaciones</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{estadisticas.seguidores}</span>
                    <span className="stat-label">Seguidores</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{estadisticas.seguidos}</span>
                    <span className="stat-label">Siguiendo</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Publicaciones del Usuario */}
            <main className="perfil-main">
              <div className="posts-section">
                <div className="content-tabs">
                  <button className="tab-btn active">
                    Publicaciones
                  </button>
                </div>

                <div className="posts-container">
                  {publicaciones.length > 0 ? (
                    publicaciones.map((pub) => (
                      <div key={pub.id_publicacion} className="post-card">
                        <h3>{pub.titulo}</h3>
                        <p>{pub.descripcion}</p>
                        <small>
                          {pub.tipo_publicacion === 'vivienda'
                            ? `🏠 Ciudad: ${pub.detalle_1} | Precio: $${pub.detalle_2}`
                            : `💼 Empresa: ${pub.detalle_1} | Salario: $${pub.detalle_2}`}
                        </small>
                        <div className="post-footer">
                          Publicado el {formatDate(pub.created_at)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">📝</div>
                      <h3>Sin publicaciones</h3>
                      <p>Este usuario aún no ha compartido publicaciones.</p>
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Mensajes de error */}
        {errorMsg && (
          <div style={{ padding: 12 }}>
            <div style={{ color: 'red' }}>{errorMsg}</div>
          </div>
        )}
      </main>
      <Footer />

      {/* Modal para ver imagen */}
      {showImageModal && currentImage && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content image-view-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">
              <Eye size={24} />
              Imagen de {currentImage.type}
            </h2>
            
            <div className="image-view-container">
              <img 
                src={currentImage.url} 
                alt={`Imagen de ${currentImage.type}`}
                className="full-size-image"
              />
            </div>
            
            <div className="modal-actions">
              <button className="btn-modal-cancel" onClick={handleCloseModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PerfilPublico;