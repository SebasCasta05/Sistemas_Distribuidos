import { useState } from "react";
import { User, Home, LayoutDashboard, Filter, MapPin, GraduationCap, X, ChevronDown, Search, Star, Users, BookOpen, Award, Globe, Clock } from "lucide-react";
import "../componentesCss/inicio.css";
import Header from './Header.jsx';
import Footer from './Footer.jsx';

function Inicio() {
  const [activeFilter, setActiveFilter] = useState(null);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedCareers, setSelectedCareers] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);

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

  const stats = [
    { icon: Users, label: "Universidades", value: "xxx+" },
    { icon: BookOpen, label: "Programas", value: "xxxx+" },
    { icon: Award, label: "Becas", value: "xxx+" },
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
  };

  const clearSelection = (type, value) => {
    if (type === "city") setSelectedCities(selectedCities.filter(c => c !== value));
    if (type === "career") setSelectedCareers(selectedCareers.filter(c => c !== value));
    if (type === "filter") setSelectedFilters(selectedFilters.filter(f => f !== value));
  };

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
                Explora más de 500 universidades, compara programas académicos y toma la mejor decisión para tu futuro profesional.
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
                <button className="apply-btn">
                  <Search size={18} />
                  Buscar Universidades
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Inicio;