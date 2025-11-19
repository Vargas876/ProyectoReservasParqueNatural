import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-400">
          © 2025 Parque Natural. Sistema de Gestión de Reservas.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Desarrollado con Spring Boot & React
        </p>
      </div>
    </footer>
  );
};
