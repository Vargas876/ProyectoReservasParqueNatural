import { useEffect, useState } from 'react';

/**
 * Hook para manejar datos en localStorage con sincronización
 * @param {string} key - Clave del localStorage
 * @param {any} initialValue - Valor inicial
 * @returns {[any, Function, Function]} [valor, setValue, removeValue]
 */
export const useLocalStorage = (key, initialValue) => {
    // Obtener valor inicial del localStorage o usar el valor por defecto
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error al leer localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Función para actualizar el valor
    const setValue = (value) => {
        try {
            // Permitir que el valor sea una función como en useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error al guardar localStorage key "${key}":`, error);
        }
    };

    // Función para eliminar el valor
    const removeValue = () => {
        try {
            window.localStorage.removeItem(key);
            setStoredValue(initialValue);
        } catch (error) {
            console.error(`Error al eliminar localStorage key "${key}":`, error);
        }
    };

    // Sincronizar entre pestañas/ventanas
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === key && e.newValue !== null) {
                try {
                    setStoredValue(JSON.parse(e.newValue));
                } catch (error) {
                    console.error('Error al sincronizar localStorage:', error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key]);

    return [storedValue, setValue, removeValue];
};
