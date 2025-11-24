import { ThemeContext } from '@/context/ThemeContext';
import { useContext } from 'react';

/**
 * Hook para acceder al contexto de tema (dark mode)
 * @returns {Object} Contexto de tema con isDarkMode, toggleTheme, etc.
 */
export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme debe ser usado dentro de ThemeProvider');
    }

    return context;
};
