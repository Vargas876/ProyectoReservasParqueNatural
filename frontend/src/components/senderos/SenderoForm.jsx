import { Alert, Button, Input, Select } from '@/components/common';
import { DIFICULTADES, ESTADOS_GENERAL } from '@/utils/constants';
import { useState } from 'react';

const SenderoForm = ({
    sendero = null,
    onSubmit,
    onCancel,
    loading = false
}) => {
    const [formData, setFormData] = useState({
        nombre: sendero?.nombre || '',
        descripcion: sendero?.descripcion || '',
        dificultad: sendero?.dificultad || '',
        duracionHoras: sendero?.duracionHoras || '',
        distanciaKm: sendero?.distanciaKm || '',
        cupoMaximoDia: sendero?.cupoMaximoDia || '',
        imagenUrl: sendero?.imagenUrl || '',
        estado: sendero?.estado || 'ACTIVO'
    });

    const [errors, setErrors] = useState({});

    const dificultadOptions = Object.values(DIFICULTADES).map(value => ({
        value,
        label: value.charAt(0) + value.slice(1).toLowerCase()
    }));

    const estadoOptions = Object.values(ESTADOS_GENERAL)
        .filter(e => e !== 'BLOQUEADO' && e !== 'ELIMINADO')
        .map(value => ({
            value,
            label: value.charAt(0) + value.slice(1).toLowerCase()
        }));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar error del campo
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        }

        if (!formData.descripcion.trim()) {
            newErrors.descripcion = 'La descripción es requerida';
        }

        if (!formData.dificultad) {
            newErrors.dificultad = 'La dificultad es requerida';
        }

        if (!formData.duracionHoras || formData.duracionHoras <= 0) {
            newErrors.duracionHoras = 'La duración debe ser mayor a 0';
        }

        if (!formData.distanciaKm || formData.distanciaKm <= 0) {
            newErrors.distanciaKm = 'La distancia debe ser mayor a 0';
        }

        if (!formData.cupoMaximoDia || formData.cupoMaximoDia <= 0) {
            newErrors.cupoMaximoDia = 'El cupo debe ser mayor a 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
            onSubmit({
                ...formData,
                duracionHoras: parseFloat(formData.duracionHoras),
                distanciaKm: parseFloat(formData.distanciaKm),
                cupoMaximoDia: parseInt(formData.cupoMaximoDia)
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Información Básica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Nombre del Sendero"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        error={errors.nombre}
                        required
                        placeholder="Ej: Cascada El Edén"
                    />

                    <Select
                        label="Dificultad"
                        name="dificultad"
                        value={formData.dificultad}
                        onChange={handleChange}
                        options={dificultadOptions}
                        error={errors.dificultad}
                        required
                        placeholder="Selecciona la dificultad"
                    />
                </div>
            </div>

            {/* Descripción */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descripción <span className="text-red-500">*</span>
                </label>
                <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows={4}
                    className={`input ${errors.descripcion ? 'input-error' : ''}`}
                    placeholder="Describe el sendero, sus características, puntos de interés..."
                    required
                />
                {errors.descripcion && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.descripcion}
                    </p>
                )}
            </div>

            {/* Características del sendero */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Características
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                        label="Duración (horas)"
                        name="duracionHoras"
                        type="number"
                        step="0.5"
                        min="0"
                        value={formData.duracionHoras}
                        onChange={handleChange}
                        error={errors.duracionHoras}
                        required
                        placeholder="Ej: 2.5"
                    />

                    <Input
                        label="Distancia (km)"
                        name="distanciaKm"
                        type="number"
                        step="0.1"
                        min="0"
                        value={formData.distanciaKm}
                        onChange={handleChange}
                        error={errors.distanciaKm}
                        required
                        placeholder="Ej: 5.2"
                    />

                    <Input
                        label="Cupo Máximo por Día"
                        name="cupoMaximoDia"
                        type="number"
                        min="1"
                        value={formData.cupoMaximoDia}
                        onChange={handleChange}
                        error={errors.cupoMaximoDia}
                        required
                        placeholder="Ej: 50"
                    />
                </div>
            </div>

            {/* Opcionales */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Información Adicional
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="URL de Imagen"
                        name="imagenUrl"
                        type="url"
                        value={formData.imagenUrl}
                        onChange={handleChange}
                        placeholder="https://ejemplo.com/imagen.jpg"
                    />

                    {sendero && (
                        <Select
                            label="Estado"
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                            options={estadoOptions}
                            required
                        />
                    )}
                </div>
            </div>

            {/* Advertencia para edición */}
            {sendero && (
                <Alert variant="warning" title="Atención">
                    Los cambios en el sendero afectarán a todas las reservas futuras asociadas.
                </Alert>
            )}

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
                >
                    {sendero ? 'Actualizar Sendero' : 'Crear Sendero'}
                </Button>
            </div>
        </form>
    );
};

export default SenderoForm;
