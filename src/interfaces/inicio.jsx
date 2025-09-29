import { useState } from "react";
import { User, Home, LayoutDashboard, Filter, MapPin, GraduationCap, X, ChevronDown, Search, Star, Users, BookOpen, Award, Globe, Clock, TrendingUp, Heart, ExternalLink, Building, DollarSign, Calendar } from "lucide-react";
import "../componentesCss/inicio.css";
import Header from './Header.jsx';
import Footer from './Footer.jsx';

function Inicio() {
  const [activeFilter, setActiveFilter] = useState(null);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedCareers, setSelectedCareers] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const cities = ["Barranquilla", "Bogotá", "Medellín", "Cartagena", "Cali"];
  const careers = [
    "Ingeniería de Sistemas", "Medicina", "Derecho",
    "Administración de Empresas", "Psicología", "Contaduría Pública",
    "Ingeniería Civil", "Arquitectura", "Enfermería", "Economía"
  ];
  const additionalFilters = [
    "Ranking / Puntaje", "Semilleros de investigación", "Duración del programa",
    "Horario (Diurno / Nocturno / FDS)", "Modalidad de titulación", "Becas o financiamiento",
    "Internacionalización", "Oferta de posgrados", "Infraestructura", "Opiniones de estudiantes ⭐"
  ];

  // Datos de universidades de ejemplo
  const allUniversities = [
    {
      id: 1,
      name: "Universidad Nacional de Colombia",
      city: "Bogotá",
      careers: ["Ingeniería de Sistemas", "Medicina", "Derecho"],
      rating: 4.8,
      reviews: 2450,
      ranking: 1,
      tuition: "Pública",
      image: "https://upload.wikimedia.org/wikipedia/commons/7/73/Plaza_Che%2C_Bogot%C3%A1.jpg",
      features: ["Ranking / Puntaje", "Semilleros de investigación", "Becas o financiamiento"],
      description: "La universidad más prestigiosa del país con excelencia académica.",
      accreditation: "Acreditación de Alta Calidad"
    },
    {
      id: 2,
      name: "Universidad de los Andes",
      city: "Bogotá",
      careers: ["Administración de Empresas", "Ingeniería Civil", "Economía"],
      rating: 4.7,
      reviews: 1890,
      ranking: 2,
      tuition: "$15M - $20M",
      image: "https://via.placeholder.com/400x200/9C27B0/white?text=Uniandes",
      features: ["Internacionalización", "Oferta de posgrados", "Infraestructura"],
      description: "Reconocida por su calidad académica e investigación de vanguardia.",
      accreditation: "Acreditación de Alta Calidad"
    },
    {
      id: 3,
      name: "Universidad Pontificia Bolivariana",
      city: "Medellín",
      careers: ["Arquitectura", "Psicología", "Ingeniería de Sistemas"],
      rating: 4.5,
      reviews: 1234,
      ranking: 5,
      tuition: "$8M - $12M",
      image: "https://via.placeholder.com/400x200/FF5722/white?text=UPB",
      features: ["Modalidad de titulación", "Semilleros de investigación"],
      description: "Universidad católica con tradición en formación integral.",
      accreditation: "Acreditación de Alta Calidad"
    },
    {
      id: 4,
      name: "Universidad del Norte",
      city: "Barranquilla",
      careers: ["Medicina", "Contaduría Pública", "Administración de Empresas"],
      rating: 4.6,
      reviews: 987,
      ranking: 8,
      tuition: "$10M - $15M",
      image: "https://via.placeholder.com/400x200/4CAF50/white?text=UNINORTE",
      features: ["Internacionalización", "Infraestructura", "Becas o financiamiento"],
      description: "Líder en la región Caribe con programas innovadores.",
      accreditation: "Acreditación de Alta Calidad"
    }
  ];

  const stats = [
    { icon: Users, label: "Universidades", value: "XXX+" },
    { icon: BookOpen, label: "Programas", value: "XXX+" },
    { icon: Award, label: "Becas", value: "XXX+" },
    { icon: Globe, label: "Ciudades", value: "5+" }
  ];

  const toggleFilter = (filterName) => {
    setActiveFilter(activeFilter === filterName ? null : filterName);
  };

  const handleCitySelection = (city) => {
    setSelectedCities(
      selectedCities.includes(city)
        ? selectedCities.filter(c => c !== city)
        : [...selectedCities, city]
    );
  };

  const handleCareerSelection = (career) => {
    setSelectedCareers(
      selectedCareers.includes(career)
        ? selectedCareers.filter(c => c !== career)
        : [...selectedCareers, career]
    );
  };

  const handleFilterSelection = (filter) => {
    setSelectedFilters(
      selectedFilters.includes(filter)
        ? selectedFilters.filter(f => f !== filter)
        : [...selectedFilters, filter]
    );
  };

  const clearAllSelections = () => {
    setSelectedCities([]);
    setSelectedCareers([]);
    setSelectedFilters([]);
    setShowResults(false);
    setSearchPerformed(false);
  };

  const clearSelection = (type, value) => {
    if (type === "city") setSelectedCities(selectedCities.filter(c => c !== value));
    if (type === "career") setSelectedCareers(selectedCareers.filter(c => c !== value));
    if (type === "filter") setSelectedFilters(selectedFilters.filter(f => f !== value));
  };

  const handleSearch = () => {
    setShowResults(true);
    setSearchPerformed(true);
    setActiveFilter(null);
  };

  // Filtrar universidades basado en selecciones
  const filteredUniversities = allUniversities.filter(uni => {
    const cityMatch = selectedCities.length === 0 || selectedCities.includes(uni.city);
    const careerMatch = selectedCareers.length === 0 || 
                       selectedCareers.some(career => uni.careers.includes(career));
    const filterMatch = selectedFilters.length === 0 || 
                       selectedFilters.some(filter => uni.features.includes(filter));
    
    return cityMatch && careerMatch && filterMatch;
  });

  return (
    <div className="app">
      <Header />

      <main className="main">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero__container">
            <div className="hero__content">
              <h1 className="hero__title">
                Encuentra la <span className="hero__highlight">Universidad</span> Perfecta
              </h1>
              <p className="hero__subtitle">
                Explora más de 150 universidades, compara programas académicos y toma la mejor decisión para tu futuro profesional.
              </p>
            </div>
            <div className="hero__stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat">
                  <div className="stat__icon">
                    <stat.icon size={24} />
                  </div>
                  <div className="stat__content">
                    <span className="stat__value">{stat.value}</span>
                    <span className="stat__label">{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="filters">
          <div className="filters__container">
            <div className="filters__header">
              <h2>Personaliza tu búsqueda</h2>
              <p>Utiliza los filtros para encontrar exactamente lo que buscas</p>
            </div>

            <div className="filters__content">
              <div className="filter-buttons">
                {/* Ciudades */}
                <div className="filter-group">
                  <button
                    className={`filter-btn ${selectedCities.length > 0 ? "has-selection" : ""}`}
                    onClick={() => toggleFilter("cities")}
                  >
                    <MapPin size={20} />
                    <span>Ciudades</span>
                    {selectedCities.length > 0 && (
                      <span className="selection-badge">{selectedCities.length}</span>
                    )}
                    <ChevronDown size={16} className={`chevron ${activeFilter === "cities" ? "rotated" : ""}`} />
                  </button>
                  {activeFilter === "cities" && (
                    <div className="filter-dropdown">
                      <div className="dropdown-header">
                        <h3>Selecciona ciudades</h3>
                      </div>
                      <div className="dropdown-content">
                        {cities.map(city => (
                          <label key={city} className="checkbox-item">
                            <input
                              type="checkbox"
                              checked={selectedCities.includes(city)}
                              onChange={() => handleCitySelection(city)}
                            />
                            <span className="checkmark"></span>
                            <span className="checkbox-label">{city}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Carreras */}
                <div className="filter-group">
                  <button
                    className={`filter-btn ${selectedCareers.length > 0 ? "has-selection" : ""}`}
                    onClick={() => toggleFilter("careers")}
                  >
                    <GraduationCap size={20} />
                    <span>Carreras</span>
                    {selectedCareers.length > 0 && (
                      <span className="selection-badge">{selectedCareers.length}</span>
                    )}
                    <ChevronDown size={16} className={`chevron ${activeFilter === "careers" ? "rotated" : ""}`} />
                  </button>
                  {activeFilter === "careers" && (
                    <div className="filter-dropdown wide">
                      <div className="dropdown-header">
                        <h3>Selecciona carreras</h3>
                      </div>
                      <div className="dropdown-content">
                        {careers.map(career => (
                          <label key={career} className="checkbox-item">
                            <input
                              type="checkbox"
                              checked={selectedCareers.includes(career)}
                              onChange={() => handleCareerSelection(career)}
                            />
                            <span className="checkmark"></span>
                            <span className="checkbox-label">{career}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Más filtros */}
                <div className="filter-group">
                  <button
                    className={`filter-btn ${selectedFilters.length > 0 ? "has-selection" : ""}`}
                    onClick={() => toggleFilter("more")}
                  >
                    <Filter size={20} />
                    <span>Más Filtros</span>
                    {selectedFilters.length > 0 && (
                      <span className="selection-badge">{selectedFilters.length}</span>
                    )}
                    <ChevronDown size={16} className={`chevron ${activeFilter === "more" ? "rotated" : ""}`} />
                  </button>
                  {activeFilter === "more" && (
                    <div className="filter-dropdown extra-wide">
                      <div className="dropdown-header">
                        <h3>Filtros adicionales</h3>
                      </div>
                      <div className="dropdown-content">
                        {additionalFilters.map(filter => (
                          <label key={filter} className="checkbox-item">
                            <input
                              type="checkbox"
                              checked={selectedFilters.includes(filter)}
                              onChange={() => handleFilterSelection(filter)}
                            />
                            <span className="checkmark"></span>
                            <span className="checkbox-label">{filter}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Filters */}
              {(selectedCities.length > 0 || selectedCareers.length > 0 || selectedFilters.length > 0) && (
                <div className="selected-filters">
                  <div className="selected-filters__header">
                    <h4>Filtros aplicados</h4>
                    <button className="clear-all" onClick={clearAllSelections}>
                      <X size={16} />
                      Limpiar todo
                    </button>
                  </div>
                  <div className="filter-chips">
                    {selectedCities.map(city => (
                      <div key={city} className="filter-chip city">
                        <MapPin size={14} />
                        <span>{city}</span>
                        <button onClick={() => clearSelection("city", city)}>
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    {selectedCareers.map(career => (
                      <div key={career} className="filter-chip career">
                        <GraduationCap size={14} />
                        <span>{career}</span>
                        <button onClick={() => clearSelection("career", career)}>
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    {selectedFilters.map(filter => (
                      <div key={filter} className="filter-chip additional">
                        <Filter size={14} />
                        <span>{filter}</span>
                        <button onClick={() => clearSelection("filter", filter)}>
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="filters__actions">
                <button className="apply-btn" onClick={handleSearch}>
                  <Search size={18} />
                  Buscar Universidades
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Resultados de Universidades */}
        {showResults && (
          <section className="results-section">
            <div className="results__container">
              <div className="results__header">
                <div>
                  <h2 className="results__title">
                    Resultados de búsqueda
                  </h2>
                  <p className="results__subtitle">
                    Se encontraron {filteredUniversities.length} universidades que coinciden con tus criterios
                  </p>
                </div>
                
                {filteredUniversities.length > 0 && (
                  <div className="results__sort">
                    <span>Ordenar por:</span>
                    <select className="sort-select">
                      <option>Ranking</option>
                      <option>Calificación</option>
                      <option>Nombre</option>
                      <option>Ciudad</option>
                    </select>
                  </div>
                )}
              </div>

              {filteredUniversities.length === 0 ? (
                <div className="no-results">
                  <div className="no-results__icon">
                    <Search size={48} />
                  </div>
                  <h3 className="no-results__title">No se encontraron resultados</h3>
                  <p className="no-results__text">Intenta ajustar tus filtros para obtener más resultados</p>
                  <button className="no-results__button" onClick={clearAllSelections}>
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <div className="university-grid">
                  {filteredUniversities.map((university) => (
                    <div key={university.id} className="university-card">
                      <div className="university-card__image-container">
                        <img 
                          src={university.image} 
                          alt={university.name}
                          className="university-card__image"
                        />
                        <div className="university-card__ranking">
                          #{university.ranking}
                        </div>
                        <button className="university-card__favorite">
                          <Heart size={20} />
                        </button>
                      </div>
                      
                      <div className="university-card__content">
                        <div className="university-card__info">
                          <h3 className="university-card__name">
                            {university.name}
                          </h3>
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
                            {university.careers.slice(0, 2).map(career => (
                              <span key={career} className="program-tag">
                                {career}
                              </span>
                            ))}
                            {university.careers.length > 2 && (
                              <span className="program-tag more">
                                +{university.careers.length - 2} más
                              </span>
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
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Inicio;