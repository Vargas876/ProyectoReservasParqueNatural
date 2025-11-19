import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Senderos from './pages/Senderos';
import NuevaReserva from './pages/NuevaReserva';
import ConfirmacionReserva from './pages/ConfirmacionReserva';
import ConsultarReserva from './pages/ConsultarReserva';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/senderos" element={<Senderos />} />
      <Route path="/reservas/nueva" element={<NuevaReserva />} />
      <Route path="/reservas/consultar" element={<ConsultarReserva />} />
      <Route path="/reservas/confirmacion" element={<ConfirmacionReserva />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
