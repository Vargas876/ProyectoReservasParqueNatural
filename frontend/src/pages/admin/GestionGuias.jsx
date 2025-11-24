import { authService, guiaService } from '@/api';
import { Button, Modal } from '@/components/common';
import { GuiaForm, GuiaList } from '@/components/guias';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const GestionGuias = () => {
    const [guias, setGuias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [guiaEditar, setGuiaEditar] = useState(null);
    const [loadingAction, setLoadingAction] = useState(false);

    useEffect(() => {
        fetchGuias();
    }, []);

    const fetchGuias = async () => {
        try {
            setLoading(true);
            // Usar getActivos() en lugar de getAll() para no mostrar eliminados
            const data = await guiaService.getActivos();
            setGuias(data);
        } catch (error) {
            console.error('Error al cargar guías:', error);
            toast.error('Error al cargar los guías');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setGuiaEditar(null);
        setShowModal(true);
    };

    const handleEdit = (guia) => {
        setGuiaEditar(guia);
        setShowModal(true);
    };

    const handleSubmit = async (data) => {
        try {
            setLoadingAction(true);

            if (guiaEditar) {
                // Usar id o idUsuario como fallback
                const idGuia = guiaEditar.idUsuario || guiaEditar.id;
                await guiaService.update(idGuia, data);
                toast.success('Guía actualizado exitosamente');
            } else {
                await authService.registerGuia(data);
                toast.success('Guía creado exitosamente');
            }

            setShowModal(false);
            setGuiaEditar(null);
            fetchGuias();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al guardar el guía');
        } finally {
            setLoadingAction(false);
        }
    };

    const handleDelete = async (guia) => {
        const confirmado = window.confirm(
            `¿Estás seguro de que deseas eliminar al guía "${guia.nombre} ${guia.apellido}"?`
        );

        if (!confirmado) return;

        try {
            // Usar id o idUsuario como fallback
            const idGuia = guia.idUsuario || guia.id;
            await guiaService.delete(idGuia);
            toast.success('Guía eliminado exitosamente');
            fetchGuias();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al eliminar el guía');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="container-custom">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Gestión de Guías
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Administra los guías del parque natural
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        icon={Plus}
                        onClick={handleCreate}
                    >
                        Nuevo Guía
                    </Button>
                </div>

                {/* Lista de guías */}
                <GuiaList
                    guias={guias}
                    loading={loading}
                    showActions
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                {/* Modal crear/editar */}
                <Modal
                    isOpen={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setGuiaEditar(null);
                    }}
                    title={guiaEditar ? 'Editar Guía' : 'Crear Nuevo Guía'}
                    size="large"
                >
                    <GuiaForm
                        guia={guiaEditar}
                        onSubmit={handleSubmit}
                        onCancel={() => {
                            setShowModal(false);
                            setGuiaEditar(null);
                        }}
                        loading={loadingAction}
                    />
                </Modal>
            </div>
        </div>
    );
};

export default GestionGuias;
