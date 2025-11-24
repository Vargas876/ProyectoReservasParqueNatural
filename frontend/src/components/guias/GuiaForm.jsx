import { Alert, Button, Input, Select } from '@/components/common';
import { ESTADOS_GENERAL } from '@/utils/constants';
import { useState } from 'react';

const GuiaForm = ({
    guia = null,
    onSubmit,
    onCancel,
    loading = false
}) => {
    const [formData, setFormData] = useState({
        cedula: guia?.cedula || '',
        nombre: guia?.nombre || '',
        apellido: guia?.apellido || '',
        telefono: guia?.telefono || '',
        email: guia?.email || '',
        password: '',
        especialidades: guia?.especialidades || '',
        maxPersonasGrupo: guia?.maxPersonasGrupo || 15,
        estado: guia?.estado || 'ACTIVO'
    });

    const [errors, setErrors] = useState({});

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

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.cedula.trim()) {
            newErrors.cedula = 'La cédula es requerida';
        }

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        }

        if (!formData.apellido.trim()) {
            newErrors.apellido = 'El apellido es requerido';
        }

        if (!formData.telefono.trim()) {
            newErrors.telefono = 'El teléfono es requerido';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!guia && !formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (!guia && formData.password.length < 8) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        }

        if (!formData.especialidades.trim()) {
            newErrors.especialidades = 'Las especialidades son requeridas';
        }

        if (!formData.maxPersonasGrupo || formData.maxPersonasGrupo < 1) {
            newErrors.maxPersonasGrupo = 'Debe ser mayor a 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
            const data = {
                ...formData,
                maxPersonasGrupo: parseInt(formData.maxPersonasGrupo)
            };

            // No enviar password si está vacío (en edición)
            if (guia && !formData.password) {
                delete data.password;
            }

            onSubmit(data);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Alerta informativa */}
            {!guia && (
                <Alert variant="info" title="Crear nuevo guía">
                    Se creará una cuenta de guía con acceso al sistema.
                </Alert>
            )}

            {/* Información personal */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Información Personal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Cédula"
                        name="cedula"
                        value={formData.cedula}
                        onChange={handleChange}
                        error={errors.cedula}
                        required
                        placeholder="1234567890"
                        disabled={!!guia}
                    />

                    <Input
                        label="Teléfono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        error={errors.telefono}
                        required
                        placeholder="3001234567"
                    />

                    <Input
                        label="Nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        error={errors.nombre}
                        required
                        placeholder="Juan"
                    />

                    <Input
                        label="Apellido"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        error={errors.apellido}
                        required
                        placeholder="Pérez"
                    />
                </div>
            </div>

            {/* Información de acceso */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Información de Acceso
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        required
                        placeholder="juan.perez@ejemplo.com"
                        disabled={!!guia}
                    />

                    <Input
                        label={guia ? "Nueva Contraseña (opcional)" : "Contraseña"}
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        required={!guia}
                        placeholder="Mínimo 8 caracteres"
                    />
                </div>
            </div>

            {/* Información profesional */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Información Profesional
                </h3>
                <div className="space-y-4">
                    <Input
                        label="Especialidades"
                        name="especialidades"
                        value={formData.especialidades}
                        onChange={handleChange}
                        error={errors.especialidades}
                        required
                        placeholder="Senderismo, Fotografía, Fauna"
                        help="Separadas por comas"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Máximo de Personas por Grupo"
                            name="maxPersonasGrupo"
                            type="number"
                            min="1"
                            max="50"
                            value={formData.maxPersonasGrupo}
                            onChange={handleChange}
                            error={errors.maxPersonasGrupo}
                            required
                            placeholder="15"
                        />

                        {guia && (
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
                >
                    {guia ? 'Actualizar Guía' : 'Crear Guía'}
                </Button>
            </div>
        </form>
    );
};

export default GuiaForm;
