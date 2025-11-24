import { guiaService } from '@/api';
import { AsignacionCard } from '@/components/asignaciones';
import { Alert, Card, EmptyState, Input } from '@/components/common';
import { useAuth } from '@/hooks';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const AgendaGuia = () => {
    const { user } = useAuth();
    const [fecha, setFecha] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [agenda, setAgenda] = useState({ recorridos: [], totalRecorridos: 0 });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAgenda();
    }, [fecha]);

    const fetchAgenda = async () => {
        try {
            setLoading(true);
            const data = await guiaService.getAgenda(user.id, fecha);
            setAgenda(data || { recorridos: [], totalRecorridos: 0 });
        } catch (error) {
            console.error('Error al cargar agenda:', error);
            toast.error('Error al cargar la agenda');
            setAgenda({ recorridos: [], totalRecorridos: 0 });
        } finally {
            setLoading(false);
        }
    };

    const handleIniciar = (asignacion) => {
        // Redirigir a detalle para iniciar
        window.location.href = `/guia/recorrido/${asignacion.idAsignacion}`;
    };

    const handleFinalizar = (asignacion) => {
        // Redirigir a detalle para finalizar
        window.location.href = `/guia/recorrido/${asignacion.idAsignacion}`;
    };

    const handleVerDetalle = (asignacion) => {
        window.location.href = `/guia/recorrido/${asignacion.idAsignacion}`;
    };

    const recorridosHoy = (agenda.recorridos || []).filter(a =>
        !a.horaFinReal &&
        a.reserva?.fechaVisita === fecha
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="container-custom max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Mi Agenda
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Gestiona tus recorridos asignados
                    </p>
                </div>

                {/* Selector de fecha y resumen */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="md:col-span-2">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary-600 flex items-center justify-center text-white">
                                <CalendarIcon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Seleccionar Fecha
                                </label>
                                <Input
                                    type="date"
                                    value={fecha}
                                    onChange={(e) => setFecha(e.target.value)}
                                />
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
                        <div className="flex items-center gap-3">
                            <Clock className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                            <div>
                                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                                    {recorridosHoy.length}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Recorridos Hoy
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Alerta informativa */}
                {recorridosHoy.length === 0 && fecha === format(new Date(), 'yyyy-MM-dd') && (
                    <Alert variant="info" className="mb-6">
                        No tienes recorridos programados para hoy.
                    </Alert>
                )}

                {/* Lista de recorridos */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="spinner mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Cargando agenda...</p>
                    </div>
                ) : !agenda.recorridos || agenda.recorridos.length === 0 ? (
                    <EmptyState
                        icon={CalendarIcon}
                        title="No hay recorridos para esta fecha"
                        description="Selecciona otra fecha para ver tus recorridos asignados."
                    />
                ) : (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Recorridos del {(() => {
                                // Parsear como fecha local para evitar cambio de zona horaria
                                const [year, month, day] = fecha.split('-').map(Number);
                                const localDate = new Date(year, month - 1, day);
                                return format(localDate, "d 'de' MMMM, yyyy", { locale: es });
                            })()}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {agenda.recorridos.map((asignacion) => (
                                <AsignacionCard
                                    key={asignacion.idAsignacion}
                                    asignacion={asignacion}
                                    onIniciar={handleIniciar}
                                    onFinalizar={handleFinalizar}
                                    onVerDetalle={handleVerDetalle}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgendaGuia;
