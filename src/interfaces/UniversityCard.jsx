import React, { useState, useEffect } from "react";
import { MapPin, Star, Heart, ExternalLink, DollarSign, Award, GraduationCap } from "lucide-react";
import "../componentesCss/universityCard.css";

function UniversityCard({ university = {} }) {
  const [liked, setLiked] = useState(university.liked || false);

  useEffect(() => {
    console.log("Datos de universidad recibidos:", university);
  }, [university]);

  useEffect(() => {
    const checkLikeStatus = async () => {
      const user = JSON.parse(sessionStorage.getItem("user"));
      
      if (user && user.id_usuario && university.id) {
        try {
          const res = await fetch("http://localhost:5000/api/universidades/like/check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_usuario: user.id_usuario,
              id_universidad: university.id,
            }),
          });

          const data = await res.json();
          if (res.ok) {
            setLiked(data.liked);
          }
        } catch (error) {
          console.error("Error al verificar like:", error);
        }
      }
    };

    checkLikeStatus();
  }, [university.id]);

  const handleLike = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    if (!user || !user.id_usuario) {
      alert("⚠️ Debes iniciar sesión primero para dar like.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/universidades/like/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: user.id_usuario,
          id_universidad: university.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error al dar like");
        return;
      }

      setLiked(data.liked);
    } catch (error) {
      console.error("Error al alternar like:", error);
      alert("Error al intentar dar like.");
    }
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return "Consulta directamente";
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (!university || Object.keys(university).length === 0) {
    return (
      <div className="university-card">
        <div className="university-card__skeleton">
          <div className="skeleton-image"></div>
          <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-details">
              <div className="skeleton-detail"></div>
              <div className="skeleton-detail"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="university-card">
      <img
        src={university.imagen || "/placeholder-university.jpg"}
        alt={university.nombre || "Universidad"}
        className="university-card__image"
        onError={(e) => {
          e.target.src = "/placeholder-university.jpg";
        }}
      />

      <div className="university-card__info">
        <h3 className="university-card__title">
          {university.nombre || "Nombre no disponible"}
        </h3>

        <p className="university-card__description">
          {university.descripcion || "Sin descripción disponible."}
        </p>

        <div className="university-card__details">
          <div className="university-card__detail">
            <MapPin size={16} />
            <span>{university.ciudad || "Ciudad no especificada"}</span>
          </div>

          <div className="university-card__detail">
            <Award size={16} />
            <span>{university.acreditacion || "Acreditación no especificada"}</span>
          </div>

          <div className="university-card__detail">
            <DollarSign size={16} />
            <span>{formatCurrency(university.costo)}</span>
          </div>

          {university.carreras && university.carreras !== 'Carreras no disponibles' && (
            <div className="university-card__detail">
              <GraduationCap size={16} />
              <span className="university-card__careers">
                {typeof university.carreras === 'string' 
                  ? university.carreras.length > 60 
                    ? university.carreras.substring(0, 60) + '...' 
                    : university.carreras
                  : 'Carreras disponibles'
                }
              </span>
            </div>
          )}

          <div className="university-card__detail">
            <Heart size={16} />
            <span>{university.likes_count || 0} likes</span>
          </div>
        </div>

        <div className="university-card__actions">
          <button
            className={`university-card__favorite ${liked ? "liked" : ""}`}
            aria-label={liked ? "Quitar like" : "Dar like"}
            onClick={handleLike}
          >
            <Heart size={20} color={liked ? "red" : "gray"} fill={liked ? "red" : "none"} />
            <span className="university-card__like-text">
              {liked ? "Quitar like" : "Dar like"}
            </span>
          </button>

          {university.link && (
            <a
              href={university.link}
              target="_blank"
              rel="noopener noreferrer"
              className="university-card__link"
            >
              <ExternalLink size={18} /> Visitar
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default UniversityCard;