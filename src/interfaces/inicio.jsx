import React, { useState, useMemo, useEffect } from "react";
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
  const [universities, setUniversities] = useState([]);
  const [cities, setCities] = useState([]);
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const additionalFilters = [
    "Acreditada",
    "Con Reconocimiento del Ministerio",
    "Universidad Pública",
    "Universidad Privada",
    "Ranking Top 10",
    "Ranking Top 20",
    "Con Posgrados",
    "Solo Pregrado"
  ];

  // Cargar datos reales desde el backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const user = JSON.parse(sessionStorage.getItem("user"));
        
        // Cargar universidades, ciudades y carreras en paralelo
        const baseUrl = 'http://localhost:5000/api/universidades';
        const uniUrl = user && user.id_usuario 
          ? `${baseUrl}?id_usuario=${user.id_usuario}`
          : baseUrl;
        
        const [uniResponse, citiesResponse, careersResponse] = await Promise.all([
          fetch(uniUrl),
          fetch(`${baseUrl}/ciudades`),
          fetch(`${baseUrl}/carreras`)
        ]);

        // Verificar respuestas
        if (!uniResponse.ok) throw new Error('Error al cargar universidades');
        if (!citiesResponse.ok) throw new Error('Error al cargar ciudades');
        if (!careersResponse.ok) throw new Error('Error al cargar carreras');

        const [uniData, citiesData, careersData] = await Promise.all([
          uniResponse.json(),
          citiesResponse.json(),
          careersResponse.json()
        ]);

        setUniversities(uniData);
        setCities(citiesData);
        setCareers(careersData);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("No se pudieron cargar todos los datos. Mostrando información limitada.");
        
        // Datos de respaldo en caso de error
        setCities(["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena"]);
        setCareers([
          "Ingeniería de Sistemas", "Medicina", "Derecho", "Administración de Empresas",
          "Psicología", "Arquitectura", "Contaduría Pública", "Comunicación Social",
          "Ingeniería Industrial", "Enfermería", "Economía", "Diseño Gráfico",
          "Ciencias Políticas", "Biología", "Turismo", "Educación"
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { icon: Users, label: "Universidades", value: `${universities.length}+` },
    { icon: BookOpen, label: "Programas", value: `${careers.length}+` },
    { icon: Award, label: "Becas", value: "XXX+" },
    { icon: Globe, label: "Ciudades", value: `${cities.length}+` }
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

  // Función auxiliar para buscar en string de carreras
  const hasCareer = (universityCarreras, targetCareer) => {
    if (!universityCarreras || universityCarreras === 'Carreras no disponibles') return false;
    const carrerasArray = universityCarreras.split(',').map(c => c.trim().toLowerCase());
    return carrerasArray.some(carrera => 
      carrera.includes(targetCareer.toLowerCase())
    );
  };

  const handleSearch = async () => {
    try {
      if (selectedCities.length > 0 || selectedCareers.length > 0) {
        setLoading(true);
        
        const user = JSON.parse(sessionStorage.getItem("user"));
        const baseUrl = 'http://localhost:5000/api/universidades/buscar';
        
        const params = new URLSearchParams();
        
        if (selectedCities.length > 0) {
          params.append('ciudad', selectedCities[0]);
        }
        
        if (selectedCareers.length > 0) {
          params.append('carrera', selectedCareers[0]);
        }
        
        if (user?.id_usuario) {
          params.append('id_usuario', user.id_usuario);
        }
        
        // Agregar filtros adicionales a la búsqueda
        selectedFilters.forEach(filter => {
          params.append('filtros', filter);
        });
        
        const response = await fetch(`${baseUrl}?${params.toString()}`);
        
        if (response.ok) {
          const data = await response.json();
          setUniversities(data);
        } else {
          throw new Error('Error en la búsqueda');
        }
      }
      
      setShowResults(true);
      setActiveFilter(null);
      
    } catch (error) {
      console.error("Error en búsqueda:", error);
      setError("Error al realizar la búsqueda. Mostrando todos los resultados.");
    } finally {
      setLoading(false);
    }
  };

  const filteredUniversities = useMemo(() => {
    if (!showResults) return [];
    
    let filtered = universities.filter(uni => {
      // Filtro por ciudad
      const cityMatch = selectedCities.length === 0 || 
                       selectedCities.includes(uni.ciudad);
      
      // Filtro por carreras
      const careerMatch = selectedCareers.length === 0 ||
                         selectedCareers.some(career => 
                           hasCareer(uni.carreras, career)
                         );
      
      // Filtros adicionales - TODOS los filtros seleccionados DEBEN cumplirse (AND)
      const filterMatch = selectedFilters.length === 0 || 
                         selectedFilters.every(filter => {
                           switch(filter) {
                             case "Acreditada":
                               return uni.acreditacion && uni.acreditacion.toLowerCase().includes('acreditada');
                             case "Con Reconocimiento del Ministerio":
                               return uni.reconocimientoministerio === true || uni.reconocimientoministerio === 1;
                             case "Universidad Pública":
                               return uni.id_tipo === 2;
                             case "Universidad Privada":
                               return uni.id_tipo === 1;
                             case "Ranking Top 10":
                               return uni.ranking_nacional && uni.ranking_nacional <= 10;
                             case "Ranking Top 20":
                               return uni.ranking_nacional && uni.ranking_nacional <= 20;
                             case "Con Posgrados":
                               return uni.tiene_posgrados === true;
                             case "Solo Pregrado":
                               return uni.tiene_posgrados === false;
                             default:
                               return true;
                           }
                         });
      
      return cityMatch && careerMatch && filterMatch;
    });

    // Ordenar resultados
    filtered.sort((a, b) => {
      // Primero por ranking nacional
      if (a.ranking_nacional !== b.ranking_nacional) {
        return a.ranking_nacional - b.ranking_nacional;
      }
      // Luego por nombre alfabético
      return a.nombre.localeCompare(b.nombre);
    });

    return filtered;
  }, [selectedCities, selectedCareers, selectedFilters, universities, showResults]);

  if (loading) {
    return (
      <div className="app">
        <Header />
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando universidades...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <Header />

      <main className="main">
        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        <section className="hero">
          <div className="hero__container">
            <div className="hero__content">
              <h1 className="hero__title">
                Encuentra la <span className="hero__highlight">Universidad</span> Perfecta
              </h1>
              <p className="hero__subtitle">
                Explora {universities.length} universidades, {careers.length} programas académicos y toma la mejor decisión para tu futuro profesional.
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