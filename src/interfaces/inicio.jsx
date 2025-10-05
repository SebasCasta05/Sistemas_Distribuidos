import React, { useState, useMemo } from "react";
import { MapPin, GraduationCap, Filter, Search, Users, BookOpen, Award, Globe, DollarSign } from "lucide-react";
import "../componentesCss/inicio.css";
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import FilterGroup from './FilterGroup.jsx';
import UniversityCard from './UniversityCard.jsx';
import NoResults from './NoResults.jsx';

function Inicio() {
  const [activeFilter, setActiveFilter] = useState(null);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedCareers, setSelectedCareers] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const cities = ["Barranquilla", "Bogotá", "Medellín", "Cartagena", "Cali"];
  const careers = [
    "Ingeniería de Sistemas", "Medicina", "Derecho",
    "Administración de Empresas", "Psicología", "Contaduría Pública",
    "Ingeniería Civil", "Arquitectura", "Enfermería", "Economía"
  ];
  const additionalFilters = [
    "Ranking / Puntaje", "Semilleros de investigación", "Duración del programa",
    "Horario (Diurno / Nocturno / FDS)", "Modalidad de titulación", "Becas o financiamiento",
    "Internacionalización", "Oferta de posgrados", "Infraestructura"
  ];

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
    setActiveFilter(null);
  };

  const clearSelection = (type, value) => {
    if (type === "city") setSelectedCities(selectedCities.filter(c => c !== value));
    if (type === "career") setSelectedCareers(selectedCareers.filter(c => c !== value));
    if (type === "filter") setSelectedFilters(selectedFilters.filter(f => f !== value));
  };

  const handleSearch = () => {
    setShowResults(true);
    setActiveFilter(null);
  };

  const filteredUniversities = useMemo(() => {
    return allUniversities.filter(uni => {
      const cityMatch = selectedCities.length === 0 || selectedCities.includes(uni.city);
      const careerMatch = selectedCareers.length === 0 ||
                         selectedCareers.some(career => uni.careers.includes(career));
      const filterMatch = selectedFilters.length === 0 ||
                         selectedFilters.some(filter => uni.features.includes(filter));
      return cityMatch && careerMatch && filterMatch;
    });
  }, [selectedCities, selectedCareers, selectedFilters, allUniversities]);

  return (
    <div className="app">
      <Header />

      <main className="main">
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

        <section className="filters">
          <div className="filters__container">
            <div className="filters__header">
              <h2>Personaliza tu búsqueda</h2>
              <p>Utiliza los filtros para encontrar exactamente lo que buscas</p>
            </div>

            <div className="filters__content">
              <div className="filter-buttons">
                <FilterGroup
                  name="cities"
                  icon={MapPin}
                  label="Ciudades"
                  options={cities}
                  selected={selectedCities}
                  onOptionToggle={handleCitySelection}
                  activeFilter={activeFilter}
                  toggleFilter={toggleFilter}
                />

                <FilterGroup
                  name="careers"
                  icon={GraduationCap}
                  label="Carreras"
                  options={careers}
                  selected={selectedCareers}
                  onOptionToggle={handleCareerSelection}
                  activeFilter={activeFilter}
                  toggleFilter={toggleFilter}
                  wide
                />

                <FilterGroup
                  name="more"
                  icon={Filter}
                  label="Más Filtros"
                  options={additionalFilters}
                  selected={selectedFilters}
                  onOptionToggle={handleFilterSelection}
                  activeFilter={activeFilter}
                  toggleFilter={toggleFilter}
                  extraWide
                />
              </div>

              {(selectedCities.length > 0 || selectedCareers.length > 0 || selectedFilters.length > 0) && (
                <div className="selected-filters">
                  <div className="selected-filters__header">
                    <h4>Filtros aplicados</h4>
                    <button className="clear-all" onClick={clearAllSelections}>
                      <svg viewBox="0 0 24 24" width="16" height="16"><path d="M6 6 L18 18 M6 18 L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                      Limpiar todo
                    </button>
                  </div>
                  <div className="filter-chips">
                    {selectedCities.map(city => (
                      <div key={city} className="filter-chip city">
                        <MapPin size={14} />
                        <span>{city}</span>
                        <button onClick={() => clearSelection("city", city)}>
                          <svg viewBox="0 0 24 24" width="14" height="14"><path d="M6 6 L18 18 M6 18 L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                        </button>
                      </div>
                    ))}
                    {selectedCareers.map(career => (
                      <div key={career} className="filter-chip career">
                        <GraduationCap size={14} />
                        <span>{career}</span>
                        <button onClick={() => clearSelection("career", career)}>
                          <svg viewBox="0 0 24 24" width="14" height="14"><path d="M6 6 L18 18 M6 18 L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                        </button>
                      </div>
                    ))}
                    {selectedFilters.map(filter => (
                      <div key={filter} className="filter-chip additional">
                        <Filter size={14} />
                        <span>{filter}</span>
                        <button onClick={() => clearSelection("filter", filter)}>
                          <svg viewBox="0 0 24 24" width="14" height="14"><path d="M6 6 L18 18 M6 18 L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
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

        {showResults && (
          <section className="results-section">
            <div className="results__container">
              <div className="results__header">
                <div>
                  <h2 className="results__title">Resultados de búsqueda</h2>
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
                <NoResults onClear={clearAllSelections} />
              ) : (
                <div className="university-grid">
                  {filteredUniversities.map((university) => (
                    <UniversityCard key={university.id} university={university} />
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

