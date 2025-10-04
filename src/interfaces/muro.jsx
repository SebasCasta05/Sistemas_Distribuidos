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

const Muro = () => {
  // 🔹 Estados principales
  const [currentCategory, setCurrentCategory] = useState("General");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [cities, setCities] = useState([]);
  const [workModes, setWorkModes] = useState([]);
  const [posts, setPosts] = useState([]);
  const [imageViewer, setImageViewer] = useState({ isOpen: false, currentIndex: 0 });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  // 🔹 Handlers (ejemplos básicos)
  const handleCategoryChange = (category) => setCurrentCategory(category);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Publicación creada:", formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContact = (post) => {
    alert(`Contactar con: ${post.nombre}`);
  };

  const openImageViewer = (index) => {
    setImageViewer({ isOpen: true, currentIndex: index });
  };

  const closeImageViewer = () => {
    setImageViewer({ ...imageViewer, isOpen: false });
  };

  const navigateImage = (direction) => {
    setImageViewer((prev) => ({
      ...prev,
      currentIndex: prev.currentIndex + direction,
    }));
  };

  const handleLoginInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", loginData);
  };

  return (
    <>
      <Header />
      <div className="muro-container">
        <main className="muro-main">
          <MuroHeader />

          <CategoryButtons
            currentCategory={currentCategory}
            handleCategoryChange={handleCategoryChange}
            setShowCreateForm={setShowCreateForm}
            loading={loading}
          />

          {showCreateForm && (
            <CreatePostForm
              formData={formData}
              setFormData={setFormData}
              handleSubmit={handleSubmit}
              handleInputChange={handleInputChange}
              cities={cities}
              workModes={workModes}
              setShowCreateForm={setShowCreateForm}
              loading={loading}
            />
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
