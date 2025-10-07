const CategoryButtons = ({
  currentCategory,
  handleCategoryChange,
  setShowCreateForm,
  loading,
}) => (
  <div className="category-buttons">
    <button
      className={`category-button ${
        currentCategory === "vivienda" ? "active" : "inactive"
      }`}
      onClick={() => handleCategoryChange("vivienda")}
      disabled={loading}
    >
      🏠 Viviendas
    </button>

    <button
      className="create-button"
      onClick={() => setShowCreateForm(true)}
      disabled={loading}
    >
      ➕ Crear Publicación
    </button>

    <button
      className={`category-button ${
        currentCategory === "empleo" ? "active" : "inactive"
      }`}
      onClick={() => handleCategoryChange("empleo")}
      disabled={loading}
    >
      💼 Empleos
    </button>
  </div>
);
//ss
export default CategoryButtons;
