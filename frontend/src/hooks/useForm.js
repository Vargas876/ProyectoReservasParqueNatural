import { useState } from 'react';

/**
 * Hook para manejar formularios con validación
 * @param {Object} initialValues - Valores iniciales del formulario
 * @param {Function} onSubmit - Función a ejecutar al enviar
 * @param {Function} validate - Función de validación (opcional)
 * @returns {Object} Propiedades y métodos del formulario
 */
export const useForm = (initialValues = {}, onSubmit, validate) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setValues(prev => ({
            ...prev,
            [name]: newValue
        }));

        // Limpiar error del campo cuando se modifica
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));

        // Validar el campo cuando pierde el foco
        if (validate) {
            const fieldErrors = validate({ [name]: values[name] });
            if (fieldErrors[name]) {
                setErrors(prev => ({
                    ...prev,
                    [name]: fieldErrors[name]
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Marcar todos los campos como touched
        const allTouched = Object.keys(values).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {});
        setTouched(allTouched);

        // Validar todos los campos
        if (validate) {
            const validationErrors = validate(values);
            setErrors(validationErrors);

            if (Object.keys(validationErrors).length > 0) {
                return;
            }
        }

        // Ejecutar submit
        try {
            setIsSubmitting(true);
            await onSubmit(values);
        } catch (error) {
            console.error('Error en submit:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    };

    const setFieldValue = (name, value) => {
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const setFieldError = (name, error) => {
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    return {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        resetForm,
        setFieldValue,
        setFieldError,
        setValues
    };
};
