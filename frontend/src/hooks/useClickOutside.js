import { useEffect, useRef } from 'react';

/**
 * Hook para detectar clicks fuera de un elemento
 * Útil para cerrar dropdowns, modales, etc.
 * @param {Function} handler - Función a ejecutar cuando se hace click fuera
 * @returns {Object} Ref para el elemento
 */
export const useClickOutside = (handler) => {
    const ref = useRef(null);

    useEffect(() => {
        const listener = (event) => {
            // No hacer nada si el click fue dentro del elemento
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            handler(event);
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [handler]);

    return ref;
};
