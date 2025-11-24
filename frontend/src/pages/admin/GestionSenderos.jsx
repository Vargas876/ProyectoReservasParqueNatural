import { senderoService } from '@/api';
import { Button, Modal } from '@/components/common';
import { SenderoForm, SenderoList } from '@/components/senderos';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const GestionSenderos = () => {
    const [senderos, setSenderos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [senderoEditar, setSenderoEditar] = useState(null);
    const [loadingAction, setLoadingAction] = useState(false);

    useEffect(() => {
        fetchSenderos();
    }, []);

    const fetchSenderos = async () => {
        try {
            setLoading(true);
            const data = await senderoService.getAll();
            setSenderos(data);
        } catch (error) {
            console.error('Error al cargar senderos:', error);
            toast.error('Error al cargar los senderos');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSenderoEditar(null);
        setShowModal(true);
    };

    const handleEdit = (sendero) => {
        setSenderoEditar(sendero);
        setShowModal(true);
    };

    const handleSubmit = async (data) => {
        try {
            setLoadingAction(true);

            if (senderoEditar) {
                await senderoService.update(senderoEditar.idSendero, data);
                toast.success('Sendero actualizado exitosamente');
            } else {
                await senderoService.create(data);
                toast.success('Sendero creado exitosamente');
            }

            setShowModal(false);
            setSenderoEditar(null);
            fetchSenderos();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al guardar el sendero');
        } finally {
            setLoadingAction(false);
        }
    };

    const handleDelete = async (sendero) => {
        const confirmado = window.confirm(
            `¿Estás seguro de que deseas eliminar el sendero "${sendero.nombre}"?`
        );

        if (!confirmado) return;

        try {
            await senderoService.delete(sendero.idSendero);
            toast.success('Sendero eliminado exitosamente');
            fetchSenderos();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al eliminar el sendero');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="container-custom">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Gestión de Senderos
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Administra los senderos del parque natural
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        icon={Plus}
                        onClick={handleCreate}
                    >
                        Nuevo Sendero
                    </Button>
                </div>

                {/* Lista de senderos */}
                <SenderoList
                    senderos={senderos}
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
                        setSenderoEditar(null);
                    }}
                    title={senderoEditar ? 'Editar Sendero' : 'Crear Nuevo Sendero'}
                    size="large"
                >
                    <SenderoForm
                        sendero={senderoEditar}
                        onSubmit={handleSubmit}
                        onCancel={() => {
                            setShowModal(false);
                            setSenderoEditar(null);
                        }}
                        loading={loadingAction}
                    />
                </Modal>
            </div>
        </div>
    );
};

export default GestionSenderos;
