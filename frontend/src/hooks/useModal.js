import { useState } from 'react';

/**
 * Hook para manejar el estado de modales
 * @param {boolean} initialState - Estado inicial (abierto/cerrado)
 * @returns {Object} Estado y funciones del modal
 */
export const useModal = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const toggle = () => setIsOpen(prev => !prev);

    return {
        isOpen,
        open,
        close,
        toggle
    };
};
