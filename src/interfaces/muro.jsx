import React, { useState, useEffect } from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import MuroHeader from "./MuroHeader.jsx";
import CategoryButtons from "./CategoryButtons.jsx";
import CreatePostForm from "./CreatePostForm.jsx";
import PostCard from "./PostCard.jsx";
import ImageViewer from "./ImageViewer.jsx";
import LoginModal from "./LoginModal.jsx";
import "../componentesCss/muro.css";

const API_URL = "http://localhost:5000/api/publicaciones";

const Muro = () => {
  // Estados principales
  const [currentCategory, setCurrentCategory] = useState("vivienda");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [imageViewer, setImageViewer] = useState({ 
    isOpen: false, 
    images: [],
    currentIndex: 0 
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  // 🔸 Cargar estado de sesión al iniciar
    useEffect(() => {
      const userData = sessionStorage.getItem("user");
      try {
        const user = JSON.parse(userData);
        setIsLoggedIn(!!user && !!user.email); // se asegura que tenga un usuario real
      } catch {
        setIsLoggedIn(false);
      }
    }, []);


  // 🔸 Cargar publicaciones al montar y al cambiar categoría
  useEffect(() => {
    fetchPosts();
  }, [currentCategory]);

  // 🔸 Función para cargar publicaciones desde la BD
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const endpoint = currentCategory === 'vivienda' ? 'viviendas' : 'empleos';
      const response = await fetch(`${API_URL}/${endpoint}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar publicaciones');
      }
      
      const data = await response.json();
      const transformedPosts = data.map(item => ({
        ...item,
        id: item.id_publicacionvivienda || item.id_publicacionempleo,
        tipo_publicacion: currentCategory
      }));
      
      setPosts(transformedPosts);
    } catch (error) {
      console.error('Error al cargar publicaciones:', error);
      alert('Error al cargar las publicaciones. Verifica que el servidor esté funcionando.');
    } finally {
      setLoading(false);
    }
  };

  // 🔸 Función para formatear timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    const now = new Date();
    const postDate = new Date(timestamp);
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'hace unos momentos';
    if (diffMins < 60) return `hace ${diffMins} minutos`;
    if (diffHours < 24) return `hace ${diffHours} horas`;
    if (diffDays === 1) return 'hace 1 día';
    return `hace ${diffDays} días`;
  };

  // 🔸 Cambiar categoría
  const handleCategoryChange = (category) => {
    setCurrentCategory(category);
  };

  // 🔸 Antes de abrir formulario, verificar login
  const handleCreateClick = () => {
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para poder crear una publicación.");
    } else {
      setShowCreateForm(true);
    }
  };


  // 🔸 Crear publicación
  const handleSubmit = async (formData) => {
    setLoading(true);

    try {
      const endpoint = formData.type === 'vivienda' ? 'viviendas' : 'empleos';
      
      let body;
      if (formData.type === 'vivienda') {
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear publicación');
      }

      await response.json();
      alert('¡Publicación creada exitosamente!');
      setShowCreateForm(false);
      await fetchPosts();
      
    } catch (error) {
      console.error('Error:', error);
      alert(`Error al crear la publicación: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 🔸 Contactar por WhatsApp
  const handleContact = (phone) => {
    const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
    let formattedPhone = cleanPhone.startsWith('57') ? cleanPhone : '57' + cleanPhone;
    const message = encodeURIComponent('¡Hola! Me interesa tu publicación que vi en MyUniversity. ¿Podrías darme más información?');
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  // 🔸 Visor de imágenes
  const openImageViewer = (images, startIndex = 0) => {
    setImageViewer({ isOpen: true, images, currentIndex: startIndex });
  };
  const closeImageViewer = () => setImageViewer({ isOpen: false, images: [], currentIndex: 0 });
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

  // 🔸 Login
  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginData.email && loginData.password) {
      alert('¡Login exitoso!');
      setIsLoggedIn(true);
      sessionStorage.setItem("isLoggedIn", "true"); // ✅ Guardar en sesión
      setShowLoginModal(false);
      setLoginData({ email: '', password: '' });
    } else {
      alert('Por favor, completa todos los campos');
    }
  };

  // 🔸 Cerrar sesión (opcional)
  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("isLoggedIn");
    alert("Has cerrado sesión.");
  };

  return (
    <>
      <Header />
      <div className="muro-container">
        <main className="muro-main">
          <MuroHeader />

          {/* 🔹 Botones de categoría */}
          <CategoryButtons
            currentCategory={currentCategory}
            handleCategoryChange={handleCategoryChange}
            setShowCreateForm={handleCreateClick} // Usa la función con validación
            loading={loading}
          />

          {showCreateForm && (
            <CreatePostForm
              onSubmit={handleSubmit}
              onClose={() => setShowCreateForm(false)}
              loading={loading}
            />
          )}

          {loading && !showCreateForm && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ fontSize: '18px', color: '#666' }}>Cargando publicaciones...</p>
            </div>
          )}

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

          <div className="posts-grid">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                handleContact={handleContact}
                openImageViewer={openImageViewer}
                cities={cities}
                workModes={workModes}
                formatTimestamp={formatTimestamp}
              />
            ))}
          </div>

          {imageViewer.isOpen && (
            <ImageViewer
              imageViewer={imageViewer}
              closeImageViewer={closeImageViewer}
              navigateImage={navigateImage}
            />
          )}

          {showLoginModal && (
            <LoginModal
              loginData={loginData}
              handleLoginInputChange={handleLoginInputChange}
              handleLoginSubmit={handleLoginSubmit}
              setShowLoginModal={setShowLoginModal}
            />
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Muro;
