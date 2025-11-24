import { horarioService, senderoService } from '@/api';
import { Alert, Badge, Button, Card, EmptyState, Input, Modal, Select } from '@/components/common';
import { Clock, Edit2, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const GestionHorarios = () => {
    const [horarios, setHorarios] = useState([]);
    const [senderos, setSenderos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [horarioEditar, setHorarioEditar] = useState(null);
    const [loadingAction, setLoadingAction] = useState(false);

    const [formData, setFormData] = useState({
        idSendero: '',
        horaInicio: '',
        horaFin: '',
        activo: true
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [senderosData] = await Promise.all([
                senderoService.getAll()
            ]);
            setSenderos(senderosData);

            // Cargar horarios de todos los senderos
            const allHorarios = [];
            for (const sendero of senderosData) {
                try {
                    const horariosData = await horarioService.getBySendero(sendero.idSendero);
                    allHorarios.push(...horariosData.map(h => ({ ...h, sendero })));
                } catch (error) {
                    console.error(`Error al cargar horarios del sendero ${sendero.idSendero}:`, error);
                }
            }
            setHorarios(allHorarios);
        } catch (error) {
            console.error('Error al cargar datos:', error);
            toast.error('Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setHorarioEditar(null);
        setFormData({
            idSendero: '',
            horaInicio: '',
            horaFin: '',
            activo: true
        });
        setShowModal(true);
    };

    const handleEdit = (horario) => {
        setHorarioEditar(horario);
        setFormData({
            idSendero: horario.sendero?.idSendero || '',
            horaInicio: horario.horaInicio,
            horaFin: horario.horaFin,
            activo: horario.activo
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoadingAction(true);

            if (horarioEditar) {
                await horarioService.update(horarioEditar.idHorario, formData);
                toast.success('Horario actualizado exitosamente');
            } else {
                await horarioService.create(formData);
                toast.success('Horario creado exitosamente');
            }

            setShowModal(false);
            setHorarioEditar(null);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al guardar el horario');
        } finally {
            setLoadingAction(false);
        }
    };

    const handleDelete = async (horario) => {
        const confirmado = window.confirm(
            '¿Estás seguro de que deseas eliminar este horario?'
        );

        if (!confirmado) return;

        try {
            await horarioService.delete(horario.idHorario);
            toast.success('Horario eliminado exitosamente');
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al eliminar el horario');
        }
    };

    const handleToggleActivo = async (horario) => {
        try {
            if (horario.activo) {
                await horarioService.desactivar(horario.idHorario);
                toast.success('Horario desactivado');
            } else {
                await horarioService.activar(horario.idHorario);
                toast.success('Horario activado');
            }
            fetchData();
        } catch (error) {
            toast.error('Error al cambiar el estado');
        }
    };

    const senderoOptions = senderos.map(s => ({
        value: s.idSendero,
        label: s.nombre
    }));

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="container-custom">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Gestión de Horarios
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Administra los horarios disponibles para cada sendero
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        icon={Plus}
                        onClick={handleCreate}
                    >
                        Nuevo Horario
                    </Button>
                </div>

                {/* Alerta informativa */}
                <Alert variant="info" className="mb-6">
                    Los horarios definen las franjas disponibles para reservar cada sendero. Los visitantes solo podrán seleccionar horarios activos.
                </Alert>

                {/* Lista de horarios */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="spinner mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Cargando horarios...</p>
                    </div>
                ) : horarios.length === 0 ? (
                    <EmptyState
                        icon={Clock}
                        title="No hay horarios configurados"
                        description="Crea horarios para que los visitantes puedan hacer reservas."
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {horarios.map((horario) => (
                            <Card key={horario.idHorario}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                            {horario.sendero?.nombre}
                                        </h3>
                                        <Badge variant={horario.activo ? 'success' : 'gray'}>
                                            {horario.activo ? 'Activo' : 'Inactivo'}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <Clock className="w-4 h-4 text-primary-600" />
                                        <span className="text-sm">
                                            {horario.horaInicio} - {horario.horaFin}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="small"
                                        icon={Edit2}
                                        onClick={() => handleEdit(horario)}
                                        className="flex-1"
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="small"
                                        icon={Trash2}
                                        onClick={() => handleDelete(horario)}
                                        className="flex-1"
                                    >
                                        Eliminar
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Modal crear/editar */}
                <Modal
                    isOpen={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setHorarioEditar(null);
                    }}
                    title={horarioEditar ? 'Editar Horario' : 'Crear Nuevo Horario'}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Select
                            label="Sendero"
                            value={formData.idSendero}
                            onChange={(e) => setFormData(prev => ({ ...prev, idSendero: e.target.value }))}
                            options={senderoOptions}
                            required
                            placeholder="Selecciona un sendero"
                        />

                        <Input
                            label="Hora de Inicio"
                            type="time"
                            value={formData.horaInicio}
                            onChange={(e) => setFormData(prev => ({ ...prev, horaInicio: e.target.value }))}
                            required
                        />

                        <Input
                            label="Hora de Fin"
                            type="time"
                            value={formData.horaFin}
                            onChange={(e) => setFormData(prev => ({ ...prev, horaFin: e.target.value }))}
                            required
                        />

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="activo"
                                checked={formData.activo}
                                onChange={(e) => setFormData(prev => ({ ...prev, activo: e.target.checked }))}
                                className="w-4 h-4 rounded border-gray-300"
                            />
                            <label htmlFor="activo" className="text-sm text-gray-700 dark:text-gray-300">
                                Horario activo
                            </label>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowModal(false)}
                                disabled={loadingAction}
                                className="flex-1"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                loading={loadingAction}
                                className="flex-1"
                            >
                                {horarioEditar ? 'Actualizar' : 'Crear'}
                            </Button>
                        </div>
                    </form>
                </Modal>
            </div>
        </div>
    );
};

export default GestionHorarios;
