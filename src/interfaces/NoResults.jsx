// =========================
// File: NoResults.jsx
// =========================
import React from 'react';
import { Search } from 'lucide-react';


function NoResults({ onClear = () => {} }) {
return (
<div className="no-results">
<div className="no-results__icon">
<Search size={48} />
</div>
<h3 className="no-results__title">No se encontraron resultados</h3>
<p className="no-results__text">Intenta ajustar tus filtros para obtener más resultados</p>
<button className="no-results__button" onClick={onClear}>
Limpiar filtros
</button>
</div>
);
}


export default NoResults;