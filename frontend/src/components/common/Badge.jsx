import { DIFICULTAD_LABELS, ESTADO_RESERVA_LABELS } from '@/utils/constants';

const Badge = ({
    children,
    variant = 'default',
    size = 'default',
    className = ''
}) => {
    const baseClasses = 'badge inline-flex items-center font-medium rounded-full';

    const variantClasses = {
        default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        success: 'badge-success',
        warning: 'badge-warning',
        danger: 'badge-danger',
        info: 'badge-info',
        primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300',
        // Colores específicos
        green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
        red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        gray: 'badge-gray'
    };

    const sizeClasses = {
        small: 'px-2 py-0.5 text-xs',
        default: 'px-3 py-1 text-sm',
        large: 'px-4 py-1.5 text-base'
    };

    return (
        <span
            className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
        >
            {children}
        </span>
    );
};

// Componente específico para estados de reserva
export const EstadoBadge = ({ estado }) => {
    const config = ESTADO_RESERVA_LABELS[estado] || { text: estado, color: 'gray' };

    return (
        <Badge variant={config.color}>
            {config.text}
        </Badge>
    );
};

// Componente específico para dificultad de senderos
export const DificultadBadge = ({ dificultad }) => {
    const config = DIFICULTAD_LABELS[dificultad] || { text: dificultad, color: 'gray' };

    return (
        <Badge variant={config.color}>
            {config.text}
        </Badge>
    );
};

export default Badge;
