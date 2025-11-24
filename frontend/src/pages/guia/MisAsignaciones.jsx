import { asignacionService } from '@/api';
import { AsignacionCard } from '@/components/asignaciones';
import { EmptyState, Select } from '@/components/common';
import { useAuth } from '@/hooks';
import { Calendar, Filter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const MisAsignaciones = () => {
    const { user } = useAuth();
    const [asignaciones, setAsignaciones] = useState([]);
    const [filtro, setFiltro] = useState('todas'); // todas, pendientes, en-curso, completadas
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAsignaciones();
    }, []);

    const fetchAsignaciones = async () => {
        try {
            setLoading(true);
            const data = await asignacionService.getByGuia(user.id);
            setAsignaciones(data);
        } catch (error) {
            console.error('Error al cargar asignaciones:', error);
            toast.error('Error al cargar las asignaciones');
        } finally {
            setLoading(false);
        }
    };

    const asignacionesFiltradas = asignaciones.filter(asignacion => {
        switch (filtro) {
            case 'pendientes':
                return !asignacion.horaInicioReal && !asignacion.horaFinReal;
            case 'en-curso':
                return asignacion.horaInicioReal && !asignacion.horaFinReal;
            case 'completadas':
                return asignacion.horaFinReal;
            default:
                return true;
        }
    });

    const handleVerDetalle = (asignacion) => {
        window.location.href = `/guia/recorrido/${asignacion.idAsignacion}`;
    };

    const filtroOptions = [
        { value: 'todas', label: 'Todas' },
        { value: 'pendientes', label: 'Pendientes' },
        { value: 'en-curso', label: 'En Curso' },
        { value: 'completadas', label: 'Completadas' }
    ];

    // Estadísticas
    const stats = {
        total: asignaciones.length,
        pendientes: asignaciones.filter(a => !a.horaInicioReal && !a.horaFinReal).length,
        enCurso: asignaciones.filter(a => a.horaInicioReal && !a.horaFinReal).length,
        completadas: asignaciones.filter(a => a.horaFinReal).length
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="container-custom">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Mis Asignaciones
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Historial completo de todos tus recorridos
                    </p>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-soft">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stats.total}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 shadow-soft">
                        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                            {stats.pendientes}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Pendientes</p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 shadow-soft">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {stats.enCurso}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">En Curso</p>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 shadow-soft">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {stats.completadas}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Completadas</p>
                    </div>
                </div>

                {/* Filtro */}
                <div className="mb-6 max-w-xs">
                    <Select
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        options={filtroOptions}
                        icon={Filter}
                    />
                </div>

                {/* Lista de asignaciones */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="spinner mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Cargando asignaciones...</p>
                    </div>
                ) : asignacionesFiltradas.length === 0 ? (
                    <EmptyState
                        icon={Calendar}
                        title="No hay asignaciones"
                        description={
                            filtro === 'todas'
                                ? 'Aún no tienes asignaciones registradas.'
                                : `No tienes asignaciones ${filtro}.`
                        }
                    />
                ) : (
                    <>
                        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                            Mostrando {asignacionesFiltradas.length} {asignacionesFiltradas.length === 1 ? 'asignación' : 'asignaciones'}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {asignacionesFiltradas.map((asignacion) => (
                                <AsignacionCard
                                    key={asignacion.idAsignacion}
                                    asignacion={asignacion}
                                    onVerDetalle={handleVerDetalle}
                                    showActions={false}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MisAsignaciones;
