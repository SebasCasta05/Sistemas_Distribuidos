import { useState } from "react";
import { User, Home, LayoutDashboard, Filter, MapPin, GraduationCap, X } from "lucide-react";
import "../componentesCss/inicio.css"; // Tu CSS original
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
    <div id="menu" className="app">
      <Header />

      <main className="main">
        <div className="centered-title">
          <h2>Bienvenido a MyUniversity</h2>
          <p>Explora las opciones de la aplicación desde el menú superior.</p>
        </div>

        <div className="filters-section">
          <div className="filters-container">
            {/* Ciudades */}
            <div className="filter-group">
              <button
                className={`filter-btn ${selectedCities.length > 0 ? "has-selection" : ""}`}
                onClick={() => toggleFilter("cities")}
              >
                <MapPin size={18} />
                <span>Ciudades</span>
                {selectedCities.length > 0 && (
                  <span className="selection-count">{selectedCities.length}</span>
                )}
              </button>
              {activeFilter === "cities" && (
                <div className="filter-dropdown">
                  <h3 className="filter-title">Selecciona ciudades</h3>
                  {cities.map(city => (
                    <label key={city} className="checkbox-label">
                      <div className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={selectedCities.includes(city)}
                          onChange={() => handleCitySelection(city)}
                        />
                        <span className="checkmark"></span>
                      </div>
                      {city}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Carreras */}
            <div className="filter-group">
              <button
                className={`filter-btn ${selectedCareers.length > 0 ? "has-selection" : ""}`}
                onClick={() => toggleFilter("careers")}
              >
                <GraduationCap size={18} />
                <span>Carreras</span>
                {selectedCareers.length > 0 && (
                  <span className="selection-count">{selectedCareers.length}</span>
                )}
              </button>
              {activeFilter === "careers" && (
                <div className="filter-dropdown">
                  <h3 className="filter-title">Selecciona carreras</h3>
                  {careers.map(career => (
                    <label key={career} className="checkbox-label">
                      <div className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={selectedCareers.includes(career)}
                          onChange={() => handleCareerSelection(career)}
                        />
                        <span className="checkmark"></span>
                      </div>
                      {career}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Más filtros */}
            <div className="filter-group">
              <button
                className={`filter-btn ${selectedFilters.length > 0 ? "has-selection" : ""}`}
                onClick={() => toggleFilter("more")}
              >
                <Filter size={18} />
                <span>Más Filtros</span>
                {selectedFilters.length > 0 && (
                  <span className="selection-count">{selectedFilters.length}</span>
                )}
              </button>
              {activeFilter === "more" && (
                <div className="filter-dropdown wide-dropdown">
                  <h3 className="filter-title">Filtrar por:</h3>
                  {additionalFilters.map(filter => (
                    <label key={filter} className="checkbox-label">
                      <div className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={selectedFilters.includes(filter)}
                          onChange={() => handleFilterSelection(filter)}
                        />
                        <span className="checkmark"></span>
                      </div>
                      {filter}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selecciones actuales */}
          {(selectedCities.length > 0 || selectedCareers.length > 0 || selectedFilters.length > 0) && (
            <div className="current-selections">
              <div className="selections-header">
                <h4>Filtros aplicados:</h4>
                <button className="clear-all-btn" onClick={clearAllSelections}>
                  <X size={14} />
                  <span>Limpiar todo</span>
                </button>
              </div>
              <div className="selection-chips">
                {selectedCities.map(city => (
                  <span key={city} className="selection-chip city-chip">
                    <MapPin size={14} />
                    {city}
                    <button onClick={() => clearSelection("city", city)}>
                      <X size={14} />
                    </button>
                  </span>
                ))}
                {selectedCareers.map(career => (
                  <span key={career} className="selection-chip career-chip">
                    <GraduationCap size={14} />
                    {career}
                    <button onClick={() => clearSelection("career", career)}>
                      <X size={14} />
                    </button>
                  </span>
                ))}
                {selectedFilters.map(filter => (
                  <span key={filter} className="selection-chip filter-chip">
                    <Filter size={14} />
                    {filter}
                    <button onClick={() => clearSelection("filter", filter)}>
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="filter-actions">
            <button className="apply-btn">Aplicar</button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Inicio;
