import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import QuienesSomos from "./pages/QuienesSomos";
import Home from "./pages/Home";
import Documentos from "./pages/Documentos";
import Ges from "./pages/Ges"; // Página GES
import Validador from "./pages/Validador"; // Página del validador
import ProtectedRoute from "./components/ProtectedRoute";
import GestionClinicaFinanciera from "./pages/GestionClinicaFinanciera";

const App = () => {
  return (
    <div>
      {/* Navbar siempre visible */}
      <Navbar />
      {/* Definición de rutas */}
      <Routes>
        {/* Ruta para Home */}
        <Route path="/" element={<Home />} />
        
        {/* Ruta protegida para "Quiénes Somos" */}
        <Route
          path="/quienes-somos"
          element={
            <ProtectedRoute>
              <QuienesSomos />
            </ProtectedRoute>
          }
        />
        
        {/* Ruta para Documentos */}
        <Route path="/documentos" element={<Documentos />} />
        
        {/* Rutas para botones principales */}
        <Route path="/ges" element={<Ges />} />
        <Route path="/gestion_clinica_financiera" element={<GestionClinicaFinanciera />} />
        
        {/* Nueva ruta para el Validador */}
        <Route path="/validador" element={<Validador />} />
      </Routes>
    </div>
  );
};

export default App;
