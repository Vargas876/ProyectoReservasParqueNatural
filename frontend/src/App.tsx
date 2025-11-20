import { Route, Routes } from 'react-router-dom';
import ConfirmacionReserva from './pages/ConfirmacionReserva';
import ConsultarReserva from './pages/ConsultarReserva';
import Dashboard from './pages/Dashboard';
import Guias from './pages/Guias';
import Home from './pages/Home';
import MisReservas from './pages/MisReservas';
import NuevaReserva from './pages/NuevaReserva';
import ReservasGuia from './pages/ReservasGuia'; // ← NUEVO
import Senderos from './pages/Senderos';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/senderos" element={<Senderos />} />
      <Route path="/reservas/nueva" element={<NuevaReserva />} />
      <Route path="/reservas/consultar" element={<ConsultarReserva />} />
      <Route path="/reservas/confirmacion" element={<ConfirmacionReserva />} />
      <Route path="/mis-reservas" element={<MisReservas />} />
      <Route path="/guias" element={<Guias />} />
      <Route path="/guias/:idGuia/reservas" element={<ReservasGuia />} /> {/* ← NUEVO */}
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
