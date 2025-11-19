import React from 'react';

interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ 
  message = 'Cargando...', 
  size = 'md',
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-[3px]',
    lg: 'h-16 w-16 border-4',
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50'
    : 'flex flex-col items-center justify-center py-12';

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      <div className="relative">
        <div
          className={`animate-spin rounded-full ${sizeClasses[size]} border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400`}
          aria-hidden="true"
        ></div>
        {size === 'lg' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/30 animate-pulse-soft"></div>
          </div>
        )}
      </div>
      {message && (
        <p className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-400 animate-pulse-soft">
          {message}
        </p>
      )}
      <span className="sr-only">{message}</span>
    </div>
  );
};
