import { Loader2 } from 'lucide-react';

const Button = ({
    children,
    variant = 'primary',
    size = 'default',
    loading = false,
    disabled = false,
    icon: Icon,
    className = '',
    ...props
}) => {
    const baseClasses = 'btn inline-flex items-center justify-center gap-2 transition-all duration-200';

    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        outline: 'btn-outline',
        danger: 'btn-danger',
        ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
    };

    const sizeClasses = {
        small: 'px-3 py-1.5 text-sm',
        default: 'px-4 py-2',
        large: 'px-6 py-3 text-lg'
    };

    const isDisabled = disabled || loading;

    return (
        <button
            className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
            disabled={isDisabled}
            {...props}
        >
            {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : Icon ? (
                <Icon className="w-5 h-5" />
            ) : null}
            {children}
        </button>
    );
};

export default Button;
