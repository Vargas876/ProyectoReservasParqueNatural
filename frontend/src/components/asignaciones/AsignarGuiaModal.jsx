import { asignacionService, guiaService } from '@/api';
import { Alert, Button, Loader, Modal } from '@/components/common';
import { GuiaSelector } from '@/components/guias';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const AsignarGuiaModal = ({
    isOpen,
    onClose,
    reserva,
    onSuccess
}) => {
    const [guias, setGuias] = useState([]);
    const [guiaSeleccionado, setGuiaSeleccionado] = useState(null);
    const [observaciones, setObservaciones] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingGuias, setLoadingGuias] = useState(false);
    const [paso, setPaso] = useState(1); // 1: Seleccionar guía, 2: Confirmar

    // Cargar guías disponibles cuando se abre el modal
    useEffect(() => {
        if (isOpen && reserva?.fechaVisita) {
            fetchGuiasDisponibles();
        }
    }, [isOpen, reserva?.fechaVisita]);

    const fetchGuiasDisponibles = async () => {
        try {
            setLoadingGuias(true);
            const data = await guiaService.getDisponibles(reserva.fechaVisita);
            setGuias(data);
        } catch (error) {
            console.error('Error al cargar guías:', error);
            toast.error('Error al cargar guías disponibles');
            setGuias([]);
        } finally {
            setLoadingGuias(false);
        }
    };

    const handleSelectGuia = (guia) => {
        setGuiaSeleccionado(guia);
        setPaso(2);
    };

    const handleConfirmar = async () => {
        if (!guiaSeleccionado) return;

        // DEBUG: Verificar estructura del guía seleccionado
        console.log('=== DEBUG ASIGNACIÓN ===');
        console.log('guiaSeleccionado:', guiaSeleccionado);
        console.log('idUsuario:', guiaSeleccionado.idUsuario);
        console.log('id:', guiaSeleccionado.id);
        console.log('keys:', Object.keys(guiaSeleccionado));

        // Determinar el ID correcto (puede ser idUsuario o id)
        const idGuia = guiaSeleccionado.idUsuario || guiaSeleccionado.id;

        if (!idGuia) {
            toast.error('Error: No se pudo obtener el ID del guía');
            console.error('Guía sin ID válido:', guiaSeleccionado);
            return;
        }

        const payload = {
            idReserva: reserva.idReserva,
            idGuia: parseInt(idGuia, 10),  // Asegurar que sea número
            observaciones: observaciones.trim() || null
        };

        console.log('Payload a enviar:', payload);

        try {
            setLoading(true);
            await asignacionService.asignarGuia(payload);

            toast.success('Guía asignado exitosamente');
            onSuccess?.();
            handleClose();
        } catch (error) {
            console.error('Error completo:', error);
            toast.error(error.response?.data?.message || 'Error al asignar guía');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setGuiaSeleccionado(null);
        setGuias([]);
        setObservaciones('');
        setPaso(1);
        onClose();
    };

    const handleVolver = () => {
        setGuiaSeleccionado(null);
        setPaso(1);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={paso === 1 ? 'Seleccionar Guía' : 'Confirmar Asignación'}
            size="xl"
        >
            {paso === 1 ? (
                // PASO 1: Seleccionar guía
                loadingGuias ? (
                    <Loader text="Cargando guías disponibles..." />
                ) : (
                    <GuiaSelector
                        guias={guias}
                        selectedGuia={guiaSeleccionado}
                        onSelect={handleSelectGuia}
                    />
                )
            ) : (
                // PASO 2: Confirmar y agregar observaciones
                <div className="space-y-6">
                    {/* Información de la reserva */}
                    <Alert variant="info" title="Información de la Reserva">
                        <div className="text-sm space-y-1 mt-2">
                            <p><strong>Sendero:</strong> {reserva?.sendero?.nombre}</p>
                            <p><strong>Fecha:</strong> {reserva?.fechaVisita}</p>
                            <p><strong>Personas:</strong> {reserva?.numeroPersonas}</p>
                        </div>
                    </Alert>

                    {/* Guía seleccionado */}
                    <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                        <h3 className="font-semibold text-primary-900 dark:text-primary-100 mb-2">
                            Guía Seleccionado
                        </h3>
                        <p className="text-primary-700 dark:text-primary-300">
                            {guiaSeleccionado?.nombre} {guiaSeleccionado?.apellido}
                        </p>
                        {guiaSeleccionado?.especialidades && (
                            <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">
                                Especialidades: {guiaSeleccionado.especialidades}
                            </p>
                        )}
                    </div>

                    {/* Observaciones */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Observaciones (opcional)
                        </label>
                        <textarea
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                            rows={3}
                            className="input"
                            placeholder="Información adicional sobre la asignación..."
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                            variant="outline"
                            onClick={handleVolver}
                            disabled={loading}
                        >
                            Volver
                        </Button>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={handleClose}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleConfirmar}
                                loading={loading}
                            >
                                Confirmar Asignación
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default AsignarGuiaModal;
