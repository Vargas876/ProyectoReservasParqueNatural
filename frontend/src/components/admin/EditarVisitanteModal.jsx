import { visitanteService } from '@/api';
import { Button, Input, Modal } from '@/components/common';
import { CreditCard, Mail, Phone, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const EditarVisitanteModal = ({
    isOpen,
    onClose,
    visitante,
    onSuccess
}) => {
    const [formData, setFormData] = useState({
        cedula: '',
        nombre: '',
        apellido: '',
        telefono: '',
        email: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visitante) {
            setFormData({
                cedula: visitante.cedula || '',
                nombre: visitante.nombre || '',
                apellido: visitante.apellido || '',
                telefono: visitante.telefono || '',
                email: visitante.email || ''
            });
        }
    }, [visitante]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.cedula.trim()) {
            newErrors.cedula = 'La cédula es requerida';
        } else if (!/^\d{6,10}$/.test(formData.cedula)) {
            newErrors.cedula = 'Cédula inválida (6-10 dígitos)';
        }

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        }

        if (!formData.apellido.trim()) {
            newErrors.apellido = 'El apellido es requerido';
        }

        if (!formData.telefono.trim()) {
            newErrors.telefono = 'El teléfono es requerido';
        } else if (!/^\d{10}$/.test(formData.telefono)) {
            newErrors.telefono = 'Teléfono inválido (10 dígitos)';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        // DEBUG: Verificar estructura del visitante
        console.log('=== DEBUG VISITANTE ===');
        console.log('visitante object:', visitante);
        console.log('visitante.idUsuario:', visitante?.idUsuario);
        console.log('visitante.id:', visitante?.id);
        console.log('visitante keys:', Object.keys(visitante || {}));

        // Usar id o idUsuario (dependiendo de lo que envíe el backend)
        const idVisitante = visitante?.idUsuario || visitante?.id;

        if (!idVisitante) {
            toast.error('Error: ID de visitante no disponible');
            console.error('Visitante sin ID:', visitante);
            return;
        }

        try {
            setLoading(true);
            // Asegurar que el ID sea numérico para el backend (tipo Long)
            const idNumerico = parseInt(idVisitante, 10);

            if (isNaN(idNumerico)) {
                throw new Error(`ID inválido: ${idVisitante}`);
            }

            console.log('Enviando update con ID:', idNumerico);
            await visitanteService.update(idNumerico, formData);
            toast.success('Visitante actualizado exitosamente');
            onSuccess?.();
            handleClose();
        } catch (error) {
            console.error('Error completo:', error);
            toast.error(error.response?.data?.message || error.message || 'Error al actualizar el visitante');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            cedula: '',
            nombre: '',
            apellido: '',
            telefono: '',
            email: ''
        });
        setErrors({});
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={`Editar Visitante - ${visitante?.nombre} ${visitante?.apellido}`}
            size="large"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información Personal */}
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
                            icon={CreditCard}
                            placeholder="1234567890"
                            required
                        />

                        <Input
                            label="Teléfono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            error={errors.telefono}
                            icon={Phone}
                            placeholder="3001234567"
                            required
                        />

                        <Input
                            label="Nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            error={errors.nombre}
                            icon={User}
                            placeholder="Juan"
                            required
                        />

                        <Input
                            label="Apellido"
                            name="apellido"
                            value={formData.apellido}
                            onChange={handleChange}
                            error={errors.apellido}
                            icon={User}
                            placeholder="Pérez"
                            required
                        />
                    </div>
                </div>

                {/* Información de Contacto */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Información de Contacto
                    </h3>
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        icon={Mail}
                        placeholder="tu@email.com"
                        required
                    />
                </div>

                {/* Botones */}
                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        loading={loading}
                    >
                        Guardar Cambios
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default EditarVisitanteModal;
