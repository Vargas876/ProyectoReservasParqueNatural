import { X } from 'lucide-react';
import { useEffect } from 'react';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'default',
    closeOnOverlayClick = true,
    showCloseButton = true
}) => {
    const sizeClasses = {
        small: 'max-w-md',
        default: 'max-w-lg',
        large: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-full mx-4'
    };

    // Bloquear scroll del body cuando el modal está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Cerrar con tecla ESC
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={closeOnOverlayClick ? onClose : undefined}
            />

            {/* Modal */}
            <div
                className={`
          relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl
          ${sizeClasses[size]}
          w-full max-h-[90vh] overflow-hidden
          transform transition-all
        `}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        {title && (
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {title}
                            </h2>
                        )}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                aria-label="Cerrar"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
