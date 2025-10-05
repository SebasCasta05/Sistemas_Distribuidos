import React from 'react';
import { MapPin, Star, Heart, ExternalLink, DollarSign, Award } from 'lucide-react';

function UniversityCard({ university = {} }) {
  return (
    <div className="university-card">
      <div className="university-card__image-container">
        <img src={university.image} alt={university.name} className="university-card__image" />
        <div className="university-card__ranking">#{university.ranking}</div>
        <button className="university-card__favorite" aria-label="Agregar a favoritos">
          <Heart size={20} />
        </button>
      </div>

      <div className="university-card__content">
        <div className="university-card__info">
          <h3 className="university-card__name">{university.name}</h3>
          <div className="university-card__location">
            <MapPin size={16} />
            <span>{university.city}</span>
          </div>

          <div className="university-card__rating">
            <div className="rating-stars">
              <Star className="star-filled" size={16} />
              <span className="rating-value">{university.rating}</span>
              <span className="rating-reviews">({university.reviews} opiniones)</span>
            </div>
          </div>

          <p className="university-card__description">{university.description}</p>
        </div>

        <div className="university-card__programs">
          <h4 className="programs__title">Programas disponibles:</h4>
          <div className="programs__tags">
            {university.careers?.slice(0, 2).map(career => (
              <span key={career} className="program-tag">{career}</span>
            ))}
            {university.careers && university.careers.length > 2 && (
              <span className="program-tag more">+{university.careers.length - 2} más</span>
            )}
          </div>
        </div>

        <div className="university-card__footer">
          <div className="university-card__tuition">
            <DollarSign size={16} />
            <span>{university.tuition}</span>
          </div>
          <button className="university-card__button">
            Ver más
            <ExternalLink size={16} />
          </button>
        </div>

        <div className="university-card__accreditation">
          <Award size={14} />
          <span>{university.accreditation}</span>
        </div>
      </div>
    </div>
  );
}

export default UniversityCard;


