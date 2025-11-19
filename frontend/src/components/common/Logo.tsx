import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  showText = true,
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <Link 
      to="/" 
      className={`flex items-center gap-3 group ${className}`}
      aria-label="Parque Natural - Ir al inicio"
    >
      <div className={`${sizeClasses[size]} flex-shrink-0 transition-transform group-hover:scale-110`}>
        <img 
          src="/vite.svg" 
          alt="Logo Parque Natural" 
          className="w-full h-full"
          aria-hidden="true"
        />
      </div>
      {showText && (
        <span className={`font-display font-bold text-primary-700 dark:text-primary-400 ${textSizes[size]} transition-colors`}>
          Parque Natural
        </span>
      )}
    </Link>
  );
};

