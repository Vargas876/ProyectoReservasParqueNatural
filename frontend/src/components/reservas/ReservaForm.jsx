import { senderoService } from '@/api';
import { Alert, Button, Input, Select } from '@/components/common';
import { REGLAS_NEGOCIO } from '@/utils/constants';
import { addDays, format } from 'date-fns';
import { useEffect, useState } from 'react';

const ReservaForm = ({
    reserva = null,
    senderoId = null,
    onSubmit,
    onCancel,
    loading = false
}) => {
    const [formData, setFormData] = useState({
        idSendero: senderoId || reserva?.sendero?.idSendero || '',
        fechaVisita: reserva?.fechaVisita || '',
        numeroPersonas: reserva?.numeroPersonas || 1,
        horaInicio: (() => {
            if (!reserva?.horaInicio) return '';
            try {
                const date = new Date(reserva.horaInicio);
                return isNaN(date.getTime()) ? '' : format(date, 'HH:mm');
            } catch (error) {
                return '';
            }
        })(),
        observaciones: reserva?.observaciones || ''
    });

    const [senderos, setSenderos] = useState([]);
    const [cupoDisponible, setCupoDisponible] = useState(null);
    const [loadingSenderos, setLoadingSenderos] = useState(false);
    const [errors, setErrors] = useState({});

    // Cargar senderos
    useEffect(() => {
        const fetchSenderos = async () => {
            try {
                setLoadingSenderos(true);
                const data = await senderoService.getActivos();
                setSenderos(data);
            } catch (error) {
                console.error('Error al cargar senderos:', error);
            } finally {
                setLoadingSenderos(false);
            }
        };

        if (!senderoId) {
            fetchSenderos();
        }
    }, [senderoId]);

    // Verificar cupo disponible cuando cambia sendero o fecha
    useEffect(() => {
        const verificarCupo = async () => {
            if (formData.idSendero && formData.fechaVisita) {
                try {
                    const response = await senderoService.calcularCupoDisponible(
                        formData.idSendero,
                        formData.fechaVisita
                    );
                    // La respuesta viene como { data: cupo }
                    setCupoDisponible(response.data || response);
                } catch (error) {
                    console.error('Error al verificar cupo:', error);
                    setCupoDisponible(null);
                }
            }
        };

        verificarCupo();
    }, [formData.idSendero, formData.fechaVisita]);

    const senderoOptions = senderos.map(s => ({
        value: s.idSendero,
        label: `${s.nombre} (${s.dificultad})`
    }));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.idSendero) {
            newErrors.idSendero = 'Debes seleccionar un sendero';
        }

        if (!formData.fechaVisita) {
            newErrors.fechaVisita = 'La fecha de visita es requerida';
        } else {
            // Validar anticipación mínima
            const fechaMinima = addDays(new Date(), 1); // Mañana
            const fechaSeleccionada = new Date(formData.fechaVisita);

            if (fechaSeleccionada < fechaMinima) {
                newErrors.fechaVisita = `La reserva debe hacerse con al menos ${REGLAS_NEGOCIO.HORAS_ANTICIPACION_MIN} horas de anticipación`;
            }
        }

        if (!formData.numeroPersonas || formData.numeroPersonas < REGLAS_NEGOCIO.MIN_PERSONAS_RESERVA) {
            newErrors.numeroPersonas = `Mínimo ${REGLAS_NEGOCIO.MIN_PERSONAS_RESERVA} persona`;
        }

        if (formData.numeroPersonas > REGLAS_NEGOCIO.MAX_PERSONAS_RESERVA) {
            newErrors.numeroPersonas = `Máximo ${REGLAS_NEGOCIO.MAX_PERSONAS_RESERVA} personas`;
        }

        if (cupoDisponible !== null && formData.numeroPersonas > cupoDisponible) {
            newErrors.numeroPersonas = `Solo hay ${cupoDisponible} cupos disponibles para esta fecha`;
        }

        if (!formData.horaInicio) {
            newErrors.horaInicio = 'La hora de inicio es requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
            // Combinar fecha y hora
            const fechaHora = `${formData.fechaVisita}T${formData.horaInicio}:00`;

            onSubmit({
                idSendero: parseInt(formData.idSendero),
                fechaVisita: formData.fechaVisita,
                numeroPersonas: parseInt(formData.numeroPersonas),
                horaInicio: fechaHora,
                observaciones: formData.observaciones
            });
        }
    };

    // Fecha mínima (mañana)
    const minFecha = format(addDays(new Date(), 1), 'yyyy-MM-dd');

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Alerta de reglas */}
            <Alert variant="info" title="Información importante">
                <ul className="text-sm space-y-1 mt-2">
                    <li>• Las reservas deben hacerse con al menos 24 horas de anticipación</li>
                    <li>• Puedes tener máximo {REGLAS_NEGOCIO.MAX_RESERVAS_ACTIVAS} reservas activas</li>
                    <li>• Grupos de {REGLAS_NEGOCIO.MIN_PERSONAS_RESERVA} a {REGLAS_NEGOCIO.MAX_PERSONAS_RESERVA} personas</li>
                </ul>
            </Alert>

            {/* Selección de sendero */}
            {!senderoId && (
                <Select
                    label="Sendero"
                    name="idSendero"
                    value={formData.idSendero}
                    onChange={handleChange}
                    options={senderoOptions}
                    error={errors.idSendero}
                    required
                    placeholder={loadingSenderos ? "Cargando senderos..." : "Selecciona un sendero"}
                    disabled={loadingSenderos}
                />
            )}

            {/* Fecha y hora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Fecha de Visita"
                    name="fechaVisita"
                    type="date"
                    min={minFecha}
                    value={formData.fechaVisita}
                    onChange={handleChange}
                    error={errors.fechaVisita}
                    required
                />

                <Input
                    label="Hora de Inicio"
                    name="horaInicio"
                    type="time"
                    value={formData.horaInicio}
                    onChange={handleChange}
                    error={errors.horaInicio}
                    required
                />
            </div>

            {/* Número de personas */}
            <Input
                label="Número de Personas"
                name="numeroPersonas"
                type="number"
                min={REGLAS_NEGOCIO.MIN_PERSONAS_RESERVA}
                max={REGLAS_NEGOCIO.MAX_PERSONAS_RESERVA}
                value={formData.numeroPersonas}
                onChange={handleChange}
                error={errors.numeroPersonas}
                required
            />

            {/* Mostrar cupo disponible */}
            {cupoDisponible !== null && formData.fechaVisita && (
                <Alert
                    variant={cupoDisponible > 0 ? "success" : "warning"}
                >
                    {cupoDisponible > 0 ? (
                        `Hay ${cupoDisponible} cupos disponibles para esta fecha`
                    ) : (
                        'No hay cupos disponibles para esta fecha. Selecciona otra fecha.'
                    )}
                </Alert>
            )}

            {/* Observaciones */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Observaciones
                </label>
                <textarea
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleChange}
                    rows={3}
                    className="input"
                    placeholder="Información adicional sobre tu reserva (opcional)"
                />
            </div>

            {/* Botones */}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    disabled={cupoDisponible === 0}
                >
                    {reserva ? 'Actualizar Reserva' : 'Crear Reserva'}
                </Button>
            </div>
        </form>
    );
};

export default ReservaForm;
