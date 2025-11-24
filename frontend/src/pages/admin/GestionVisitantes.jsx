import { visitanteService } from '@/api';
import { EditarVisitanteModal, UsuariosTable } from '@/components/admin';
import { Alert } from '@/components/common';
import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const GestionVisitantes = () => {
    const [visitantes, setVisitantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [visitanteSeleccionado, setVisitanteSeleccionado] = useState(null);

    useEffect(() => {
        fetchVisitantes();
    }, []);

    const fetchVisitantes = async () => {
        try {
            setLoading(true);
            const data = await visitanteService.getAll();
            setVisitantes(data);
        } catch (error) {
            console.error('Error al cargar visitantes:', error);
            toast.error('Error al cargar los visitantes');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (visitante) => {
        setVisitanteSeleccionado(visitante);
        setShowEditModal(true);
    };

    const handleDelete = async (visitante) => {
        const confirmado = window.confirm(
            `¿Estás seguro de que deseas eliminar al visitante "${visitante.nombre} ${visitante.apellido}"?\n\nEsto eliminará también todas sus reservas.`
        );

        if (!confirmado) return;

        try {
            await visitanteService.delete(visitante.idUsuario);
            toast.success('Visitante eliminado exitosamente');
            fetchVisitantes();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al eliminar el visitante');
        }
    };

    const handleCambiarEstado = async (visitante, nuevoEstado) => {
        try {
            await visitanteService.cambiarEstado(visitante.idUsuario, nuevoEstado);
            toast.success(`Estado cambiado a ${nuevoEstado}`);
            fetchVisitantes();
        } catch (error) {
            toast.error('Error al cambiar el estado');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="container-custom">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Gestión de Visitantes
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Administra los usuarios visitantes del sistema
                    </p>
                </div>

                {/* Alerta informativa */}
                <Alert variant="info" className="mb-6">
                    Los visitantes se registran automáticamente desde la página pública. Aquí puedes gestionar su estado y eliminar cuentas si es necesario.
                </Alert>

                {/* Estadísticas rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-soft">
                        <div className="flex items-center gap-3">
                            <Users className="w-8 h-8 text-primary-600" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {visitantes.length}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Total Visitantes
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 shadow-soft">
                        <div className="flex items-center gap-3">
                            <Users className="w-8 h-8 text-green-600" />
                            <div>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {visitantes.filter(v => v.estado === 'ACTIVO').length}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Activos
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 shadow-soft">
                        <div className="flex items-center gap-3">
                            <Users className="w-8 h-8 text-gray-600" />
                            <div>
                                <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                                    {visitantes.filter(v => v.estado !== 'ACTIVO').length}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Inactivos
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabla de visitantes */}
                <UsuariosTable
                    usuarios={visitantes}
                    tipo="visitante"
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={loading}
                />

                {/* Modal de edición */}
                {visitanteSeleccionado && (
                    <EditarVisitanteModal
                        isOpen={showEditModal}
                        onClose={() => {
                            setShowEditModal(false);
                            setVisitanteSeleccionado(null);
                        }}
                        visitante={visitanteSeleccionado}
                        onSuccess={fetchVisitantes}
                    />
                )}
            </div>
        </div>
    );
};

export default GestionVisitantes;
