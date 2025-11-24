import { Loader2 } from 'lucide-react';

const Loader = ({ size = 'default', text = 'Cargando...' }) => {
    const sizeClasses = {
        small: 'w-8 h-8',
        default: 'w-12 h-12',
        large: 'w-16 h-16'
    };

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className={`${sizeClasses[size]} text-primary-600 animate-spin`} />
            {text && (
                <p className="mt-4 text-gray-600 dark:text-gray-400">{text}</p>
            )}
        </div>
    );
};

export default Loader;
