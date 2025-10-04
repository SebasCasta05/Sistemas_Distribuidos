import React, { useState, useEffect } from 'react';
import {
  User, Mail, GraduationCap, Calendar, Edit3, Camera, Award, Trash2
} from 'lucide-react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import '../componentesCss/perfil.css';

function Perfil() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState('/api/placeholder/140/140');
  const [coverImage, setCoverImage] = useState('');
  const [activeTab, setActiveTab] = useState('publicaciones');
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [publicaciones, setPublicaciones] = useState([]);
  const [deletingIds, setDeletingIds] = useState(new Set()); // evitar doble click al eliminar

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('usuario');
    localStorage.removeItem('user');
    localStorage.removeItem('usuario');
    window.location.href = '/login';
  };

  // Cargar datos del usuario y sus publicaciones (todo en un único flujo asíncrono)
  useEffect(() => {
    const loadProfileAndPublicaciones = async () => {
      setLoading(true);
      setErrorMsg('');
      setStatusMsg('');

      // Soportar distintos nombres posibles en sessionStorage/localStorage
      const raw =
        sessionStorage.getItem('user') ||
        sessionStorage.getItem('usuario') ||
        localStorage.getItem('user') ||
        localStorage.getItem('usuario');

      let sessionUser = null;
      try {
        sessionUser = raw ? JSON.parse(raw) : null;
      } catch (e) {
        console.warn('No se pudo parsear sessionStorage user:', e);
        sessionUser = null;
      }

      if (!sessionUser || !(sessionUser.id_usuario || sessionUser.id)) {
        setErrorMsg('No hay usuario logueado. Por favor inicia sesión.');
        setLoading(false);
        return;
      }

      const id = sessionUser.id_usuario || sessionUser.id;

      // Obtener info del usuario (intento; si falla, seguimos con publicaciones)
      try {
        const userRes = await fetch(`http://localhost:5000/api/users/${id}`);
        if (!userRes.ok) {
          const errBody = await userRes.json().catch(() => ({}));
          throw new Error(errBody.message || 'Error al obtener usuario');
        }
        const userData = await userRes.json();
        // Normalizar algunos campos para usarlos en la UI
        const normalizedUser = {
          ...userData,
          email: userData.email || userData.correo || userData.mail || userData.email_usuario,
          id_usuario: userData.id_usuario || userData.id || userData.user_id,
        };
        setUserInfo(normalizedUser);
      } catch (err) {
        console.error('Error al obtener usuario:', err);
        // Mostrar mensaje, pero no interrumpir la carga de publicaciones
        setErrorMsg(prev => prev || (err.message || 'Error cargando perfil'));
      }

      // Obtener publicaciones del usuario a través de tu endpoint consolidado
      try {
        const pubsRes = await fetch(`http://localhost:5000/api/publicaciones/usuario/${id}`);
        if (!pubsRes.ok) {
          const errBody = await pubsRes.json().catch(() => ({}));
          throw new Error(errBody.message || 'Error al obtener publicaciones');
        }
        const pubsData = await pubsRes.json();
        console.log('Publicaciones recibidas del backend:', pubsData);

        // Normalizar cada publicación a la forma esperada por la UI:
        // { id_publicacion, titulo, descripcion, tipo_publicacion, detalle_1, detalle_2, created_at, autor_nombre, autor_apellido }
        const normalized = (Array.isArray(pubsData) ? pubsData : []).map((item) => {
          // Intentamos extraer el id de varias formas para compatibilidad
          const id_pub =
            item.id_publicacion ||
            item.id_publicacionvivienda ||
            item.id_publicacionempleo ||
            item.id;

          // Tipo: preferimos el campo explícito, si no, inferimos
          const tipo =
            item.tipo_publicacion ||
            item.tipo ||
            (item.precio !== undefined ? 'vivienda' : item.empresa ? 'empleo' : '');

          // detalle_1 y detalle_2 ya pueden venir como 'detalle_1' / 'detalle_2' desde la query
          const detalle1 = item.detalle_1 || item.ciudad || item.empresa || '';
          const detalle2 =
            item.detalle_2 ||
            (item.precio !== undefined ? String(item.precio) : (item.salario !== undefined ? String(item.salario) : ''));

          const createdAt = item.created_at || item.createdAt || item.fecha_creacion || item.fecha || null;

          return {
            id_publicacion: id_pub,
            titulo: item.titulo || item.nombre || item.name || '',
            descripcion: item.descripcion || item.body || '',
            tipo_publicacion: tipo,
            detalle_1: detalle1,
            detalle_2: detalle2,
            created_at: createdAt,
            autor_nombre: item.autor_nombre || item.nombre_autor || item.nombre || '',
            autor_apellido: item.autor_apellido || item.apellido_autor || item.apellido || '',
          };
        });

        setPublicaciones(normalized);
      } catch (err) {
        console.error('Error cargando publicaciones:', err);
        setErrorMsg(prev => prev || (err.message || 'No se pudieron cargar las publicaciones'));
        // mantener publicaciones como array vacío
      } finally {
        setLoading(false);
      }
    };

    loadProfileAndPublicaciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfileImage(URL.createObjectURL(file));
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setCoverImage(URL.createObjectURL(file));
  };

  const handleInputChange = (field, value) => {
    setUserInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleEdit = async () => {
    setErrorMsg('');
    setStatusMsg('');

    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    if (!userInfo || !userInfo.nombre || !userInfo.apellido || !userInfo.email) {
      setErrorMsg('Nombre, apellido y email son obligatorios.');
      return;
    }

    setStatusMsg('Guardando cambios...');
    try {
      const res = await fetch(`http://localhost:5000/api/users/${userInfo.id_usuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userInfo),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al actualizar perfil');
      setUserInfo(data);
      // Actualizar sessionStorage para coherencia con el resto de la app
      try {
        sessionStorage.setItem('user', JSON.stringify(data));
      } catch (e) {
        console.warn('No se pudo actualizar sessionStorage tras editar perfil:', e);
      }
      setIsEditing(false);
      setStatusMsg('Perfil actualizado correctamente ✅');
      // limpiar mensaje después de un tiempo
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Error actualizando perfil');
      setStatusMsg('');
    }
  };

  const handleTabChange = (tab) => setActiveTab(tab);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString();
  };

  // ---- ELIMINAR publicación desde perfil (llama a backend)
  const handleDeletePublicacion = async (id_publicacion) => {
    const confirmacion = window.confirm('¿Estás seguro de eliminar esta publicación?');
    if (!confirmacion) return;

    // Evitar doble clic / mostrar estado de borrado
    setDeletingIds(prev => new Set(prev).add(id_publicacion));
    setErrorMsg('');
    setStatusMsg('');

    try {
      const res = await fetch(`http://localhost:5000/api/publicaciones/${id_publicacion}`, {
        method: 'DELETE',
      });

      const resBody = await res.json().catch(() => ({}));

      if (!res.ok) {
        // manejar distintos formatos de error
        const message = resBody.message || resBody.error || 'Error al eliminar publicación';
        throw new Error(message);
      }

      // Actualiza UI local (optimista)
      setPublicaciones(prev => prev.filter(p => p.id_publicacion !== id_publicacion));
      setStatusMsg('Publicación eliminada correctamente ✅');
      // limpiar mensaje y estado de borrado después de un tiempo
      setTimeout(() => setStatusMsg(''), 3500);
    } catch (err) {
      console.error('Error eliminando publicación:', err);
      setErrorMsg(err.message || 'No se pudo eliminar la publicación');
    } finally {
      // quitar id del set deletingIds
      setDeletingIds(prev => {
        const next = new Set(prev);
        next.delete(id_publicacion);
        return next;
      });
    }
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
            <p>Inicia sesión para ver tu perfil.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const memberSince = userInfo?.fecha_creacion ? formatDate(userInfo.fecha_creacion) : (userInfo?.fechaCreacion ? formatDate(userInfo.fechaCreacion) : '—');

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div className="perfil-container">

          {/* AVATAR + INFO */}
          <div className="perfil-header">

            <div className="perfil-info">
              <div className="perfil-main-info">
                {isEditing ? (
                  <div className="edit-form">
                    <div className="two-columns">
                      <input
                        type="text"
                        value={userInfo?.nombre || ''}
                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                        className="edit-input name-input"
                        placeholder="Nombre"
                      />
                      <input
                        type="text"
                        value={userInfo?.apellido || ''}
                        onChange={(e) => handleInputChange('apellido', e.target.value)}
                        className="edit-input surname-input"
                        placeholder="Apellido"
                      />
                    </div>
                    <input
                      type="text"
                      value={userInfo?.direccion || ''}
                      onChange={(e) => handleInputChange('direccion', e.target.value)}
                      className="edit-input title-input"
                      placeholder="Dirección"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="perfil-nombre">{`${userInfo?.nombre} ${userInfo?.apellido}`}</h1>
                    <p className="perfil-titulo">{userInfo.tipo_usuario}</p>
                    <div className="perfil-ubicacion"><span>📍 {userInfo.direccion || 'No registrada'}</span></div>
                  </>
                )}
              </div>

              <div className="perfil-acciones">
                <button className={`btn-primary ${isEditing ? 'saving' : ''}`} onClick={handleToggleEdit}>
                  <Edit3 size={18} />
                  {isEditing ? 'Guardar Cambios' : 'Editar Perfil'}
                </button>
                <button className="btn-secondary" onClick={handleLogout}>Cerrar Sesión</button>
              </div>
            </div>
          </div>

          {/* CONTENIDO PRINCIPAL */}
          <div className="perfil-content">
            <aside className="perfil-sidebar">
              <div className="info-card">
                <h3 className="card-title"><User size={20} /> Información Personal</h3>
                <div className="info-list">
                  <div className="info-item"><Mail size={16} /> <span>{userInfo.email}</span></div>
                  <div className="info-item"><GraduationCap size={16} /> <span>{userInfo.tipo_usuario}</span></div>
                  <div className="info-item"><Calendar size={16} /> <span>Miembro desde {memberSince}</span></div>
                  <div className="info-item"><User size={16} /> <span>Tel: {userInfo.telefono || 'No registrado'}</span></div>
                </div>
              </div>

              <div className="stats-card">
                <h3 className="card-title"><Award size={20} /> Estadísticas</h3>
                <div className="stats-grid">
                  <div className="stat-item"><span className="stat-number">{publicaciones.length}</span><span className="stat-label">Publicaciones</span></div>
                  <div className="stat-item"><span className="stat-number">48</span><span className="stat-label">Seguidores</span></div>
                  <div className="stat-item"><span className="stat-number">23</span><span className="stat-label">Siguiendo</span></div>
                </div>
              </div>
            </aside>

            <main className="perfil-main">
              <div className="posts-section">
                <div className="content-tabs">
                  <button className={`tab-btn ${activeTab === 'publicaciones' ? 'active' : ''}`} onClick={() => handleTabChange('publicaciones')}>
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
                        <div className="post-footer">Publicado el {formatDate(pub.created_at)}</div>

                        {/* Botón eliminar */}
                        <div style={{ marginTop: 8 }}>
                          <button
                            className="btn-delete"
                            onClick={() => handleDeletePublicacion(pub.id_publicacion)}
                            disabled={deletingIds.has(pub.id_publicacion)}
                            title={deletingIds.has(pub.id_publicacion) ? 'Eliminando...' : 'Eliminar publicación'}
                          >
                            <Trash2 size={14} /> {deletingIds.has(pub.id_publicacion) ? 'Eliminando...' : 'Eliminar'}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">📝</div>
                      <h3>¡Comienza a compartir!</h3>
                      <p>Aún no tienes publicaciones. Comparte tus ideas, proyectos y experiencias con la comunidad.</p>
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>

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
