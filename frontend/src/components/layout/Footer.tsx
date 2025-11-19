import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    navegacion: [
      { to: '/', label: 'Inicio' },
      { to: '/senderos', label: 'Senderos' },
      { to: '/reservas/nueva', label: 'Reservar' },
      { to: '/reservas/consultar', label: 'Consultar' },
    ],
    informacion: [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '#', label: 'Sobre Nosotros' },
      { to: '#', label: 'Contacto' },
      { to: '#', label: 'Términos y Condiciones' },
    ],
  };

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 border-t border-gray-800 dark:border-gray-900 mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo y descripción */}
          <div className="md:col-span-2">
            <Logo showText={true} size="md" className="mb-4" />
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Sistema de gestión de reservas para explorar los senderos más hermosos de nuestro parque natural. 
              Reserva tu aventura y vive una experiencia única en la naturaleza.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Navegación</h3>
            <ul className="space-y-2">
              {footerLinks.navegacion.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Información */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Información</h3>
            <ul className="space-y-2">
              {footerLinks.informacion.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 dark:border-gray-900 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {currentYear} Parque Natural. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Desarrollado con</span>
              <span className="text-primary-400">Spring Boot</span>
              <span>&</span>
              <span className="text-primary-400">React</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
