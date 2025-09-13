import "../componentesCss/inicio.css";
import Header from './Header.jsx';
import Footer from './Footer.jsx';

function Inicio() {
  return (
    <div id="menu">
      <Header />
      <h2>¿Se muestra este texto?</h2>
      <Footer />
    </div>
  );
}

export default Inicio;