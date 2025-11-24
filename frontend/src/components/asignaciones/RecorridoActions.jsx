import { asignacionService } from '@/api';
import { Alert, Button, Modal } from '@/components/common';
import { CheckCircle, Play } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

const RecorridoActions = ({ asignacion, onSuccess }) => {
    const [showIniciarModal, setShowIniciarModal] = useState(false);
    const [showFinalizarModal, setShowFinalizarModal] = useState(false);
    const [loading, setLoading] = useState(false);

    // Estado para iniciar
    const [observacionesInicio, setObservacionesInicio] = useState('');

    // Estado para finalizar
    const [observacionesFin, setObservacionesFin] = useState('');
    const [huboIncidencias, setHuboIncidencias] = useState(false);
    const [descripcionIncidencias, setDescripcionIncidencias] = useState('');

    const { horaInicioReal, horaFinReal } = asignacion;

    const puedeIniciar = !horaInicioReal && !horaFinReal;
    const puedeFinalizar = horaInicioReal && !horaFinReal;

    // Iniciar recorrido
    const handleIniciar = async () => {
        try {
            setLoading(true);
            await asignacionService.iniciarRecorrido({
                idAsignacion: asignacion.idAsignacion,
                observacionesInicio: observacionesInicio.trim() || null
            });

            toast.success('Recorrido iniciado exitosamente');
            setShowIniciarModal(false);
            setObservacionesInicio('');
            onSuccess?.();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al iniciar recorrido');
        } finally {
            setLoading(false);
        }
    };

    // Finalizar recorrido
    const handleFinalizar = async () => {
        try {
            setLoading(true);

            const data = {
                idAsignacion: asignacion.idAsignacion,
                observacionesGuia: observacionesFin.trim() || null,
                huboIncidencias
            };

            if (huboIncidencias && descripcionIncidencias.trim()) {
                data.descripcionIncidencias = descripcionIncidencias.trim();
            }

            await asignacionService.finalizarRecorrido(data);

            toast.success('Recorrido finalizado exitosamente');
            setShowFinalizarModal(false);
            setObservacionesFin('');
            setHuboIncidencias(false);
            setDescripcionIncidencias('');
            onSuccess?.();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al finalizar recorrido');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Botones de acción */}
            <div className="flex gap-3">
                {puedeIniciar && (
                    <Button
                        variant="primary"
                        icon={Play}
                        onClick={() => setShowIniciarModal(true)}
                    >
                        Iniciar Recorrido
                    </Button>
                )}

                {puedeFinalizar && (
                    <Button
                        variant="primary"
                        icon={CheckCircle}
                        onClick={() => setShowFinalizarModal(true)}
                    >
                        Finalizar Recorrido
                    </Button>
                )}
            </div>

            {/* Modal: Iniciar Recorrido */}
            <Modal
                isOpen={showIniciarModal}
                onClose={() => setShowIniciarModal(false)}
                title="Iniciar Recorrido"
            >
                <div className="space-y-6">
                    <Alert variant="info" title="Información">
                        Estás por iniciar el recorrido. Se registrará la hora actual como hora de inicio.
                    </Alert>

                    {/* Información de la asignación */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-2">
                        <p className="text-sm">
                            <strong>Sendero:</strong> {asignacion.reserva?.sendero?.nombre}
                        </p>
                        <p className="text-sm">
                            <strong>Personas:</strong> {asignacion.reserva?.numeroPersonas}
                        </p>
                        <p className="text-sm">
                            <strong>Visitante:</strong> {asignacion.reserva?.visitante?.nombre} {asignacion.reserva?.visitante?.apellido}
                        </p>
                    </div>

                    {/* Observaciones */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Observaciones al inicio (opcional)
                        </label>
                        <textarea
                            value={observacionesInicio}
                            onChange={(e) => setObservacionesInicio(e.target.value)}
                            rows={3}
                            className="input"
                            placeholder="Condiciones climáticas, estado del grupo, etc..."
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setShowIniciarModal(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleIniciar}
                            loading={loading}
                            icon={Play}
                        >
                            Confirmar Inicio
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Modal: Finalizar Recorrido */}
            <Modal
                isOpen={showFinalizarModal}
                onClose={() => setShowFinalizarModal(false)}
                title="Finalizar Recorrido"
            >
                <div className="space-y-6">
                    <Alert variant="success" title="Finalizar Recorrido">
                        Se registrará la hora actual como hora de finalización.
                    </Alert>

                    {/* Observaciones del guía */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Observaciones del recorrido <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={observacionesFin}
                            onChange={(e) => setObservacionesFin(e.target.value)}
                            rows={3}
                            className="input"
                            placeholder="Describe cómo fue el recorrido, comportamiento del grupo, puntos de interés visitados..."
                            required
                        />
                    </div>

                    {/* Incidencias */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            <input
                                type="checkbox"
                                checked={huboIncidencias}
                                onChange={(e) => setHuboIncidencias(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300"
                            />
                            ¿Hubo alguna incidencia durante el recorrido?
                        </label>

                        {huboIncidencias && (
                            <div className="pl-6">
                                <Alert variant="warning" className="mb-3">
                                    <p className="text-sm">
                                        Por favor describe detalladamente las incidencias ocurridas.
                                    </p>
                                </Alert>
                                <textarea
                                    value={descripcionIncidencias}
                                    onChange={(e) => setDescripcionIncidencias(e.target.value)}
                                    rows={3}
                                    className="input"
                                    placeholder="Describe las incidencias: accidentes, problemas en el sendero, comportamiento inadecuado, etc..."
                                    required={huboIncidencias}
                                />
                            </div>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                            variant="outline"
                            onClick={() => setShowFinalizarModal(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleFinalizar}
                            loading={loading}
                            icon={CheckCircle}
                            disabled={!observacionesFin.trim() || (huboIncidencias && !descripcionIncidencias.trim())}
                        >
                            Finalizar Recorrido
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default RecorridoActions;
