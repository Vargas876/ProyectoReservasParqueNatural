import { Navigate, Route, Routes } from 'react-router-dom';

// Route Guards
import PublicRoute from './PublicRoute';
import RoleRoute from './RoleRoute';

// Pages - Public
import {
    Home,
    Login,
    Register,
    SenderoDetalle,
    Senderos
} from '@/pages/public';

// Pages - Visitante
import {
    CrearReserva,
    EditarReserva,
    MiPerfil as MiPerfilVisitante,
    MisReservas
} from '@/pages/visitante';

// Pages - Guia
import {
    AgendaGuia,
    DetalleRecorrido,
    MiPerfil as MiPerfilGuia,
    MisAsignaciones
} from '@/pages/guia';

// Pages - Admin
import {
    Dashboard,
    GestionGuias,
    GestionHorarios,
    GestionReservas,
    GestionSenderos,
    GestionVisitantes,
    Reportes
} from '@/pages/admin';

// Error Pages
import { NotFound, Unauthorized } from '@/pages';

import { ROLES } from '@/utils/constants';

const AppRoutes = () => {
    return (
        <Routes>
            {/* ==================== RUTAS PÚBLICAS ==================== */}
            <Route path="/" element={<Home />} />
            <Route path="/senderos" element={<Senderos />} />
            <Route path="/senderos/:id" element={<SenderoDetalle />} />

            {/* Rutas de autenticación - Redirigen si ya está autenticado */}
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                }
            />

            {/* ==================== RUTAS DE VISITANTE ==================== */}
            <Route
                path="/reserva/crear"
                element={
                    <RoleRoute roles={[ROLES.VISITANTE]}>
                        <CrearReserva />
                    </RoleRoute>
                }
            />
            <Route
                path="/mis-reservas"
                element={
                    <RoleRoute roles={[ROLES.VISITANTE]}>
                        <MisReservas />
                    </RoleRoute>
                }
            />
            <Route
                path="/reserva/editar/:id"
                element={
                    <RoleRoute roles={[ROLES.VISITANTE]}>
                        <EditarReserva />
                    </RoleRoute>
                }
            />
            <Route
                path="/mi-perfil"
                element={
                    <RoleRoute roles={[ROLES.VISITANTE]}>
                        <MiPerfilVisitante />
                    </RoleRoute>
                }
            />

            {/* ==================== RUTAS DE GUÍA ==================== */}
            <Route
                path="/guia/agenda"
                element={
                    <RoleRoute roles={[ROLES.GUIA]}>
                        <AgendaGuia />
                    </RoleRoute>
                }
            />
            <Route
                path="/guia/asignaciones"
                element={
                    <RoleRoute roles={[ROLES.GUIA]}>
                        <MisAsignaciones />
                    </RoleRoute>
                }
            />
            <Route
                path="/guia/recorrido/:id"
                element={
                    <RoleRoute roles={[ROLES.GUIA]}>
                        <DetalleRecorrido />
                    </RoleRoute>
                }
            />
            <Route
                path="/guia/perfil"
                element={
                    <RoleRoute roles={[ROLES.GUIA]}>
                        <MiPerfilGuia />
                    </RoleRoute>
                }
            />

            {/* ==================== RUTAS DE ADMIN ==================== */}
            <Route
                path="/admin/dashboard"
                element={
                    <RoleRoute roles={[ROLES.ADMIN]}>
                        <Dashboard />
                    </RoleRoute>
                }
            />
            <Route
                path="/admin/senderos"
                element={
                    <RoleRoute roles={[ROLES.ADMIN]}>
                        <GestionSenderos />
                    </RoleRoute>
                }
            />
            <Route
                path="/admin/reservas"
                element={
                    <RoleRoute roles={[ROLES.ADMIN]}>
                        <GestionReservas />
                    </RoleRoute>
                }
            />
            <Route
                path="/admin/guias"
                element={
                    <RoleRoute roles={[ROLES.ADMIN]}>
                        <GestionGuias />
                    </RoleRoute>
                }
            />
            <Route
                path="/admin/visitantes"
                element={
                    <RoleRoute roles={[ROLES.ADMIN]}>
                        <GestionVisitantes />
                    </RoleRoute>
                }
            />
            <Route
                path="/admin/horarios"
                element={
                    <RoleRoute roles={[ROLES.ADMIN]}>
                        <GestionHorarios />
                    </RoleRoute>
                }
            />
            <Route
                path="/admin/reportes"
                element={
                    <RoleRoute roles={[ROLES.ADMIN]}>
                        <Reportes />
                    </RoleRoute>
                }
            />

            {/* ==================== RUTAS DE ERROR ==================== */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
    );
};

export default AppRoutes;
