import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-primary-700 text-white shadow-lg">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold flex items-center">
            🌲 Parque Natural
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-primary-200 transition-colors">
              Inicio
            </Link>
            <Link to="/senderos" className="hover:text-primary-200 transition-colors">
              Senderos
            </Link>
            <Link to="/reservas/nueva" className="hover:text-primary-200 transition-colors">
              Reservar
            </Link>
            <Link to="/reservas/consultar" className="hover:text-primary-200 transition-colors">
              Consultar
            </Link>
            <Link to="/dashboard" className="hover:text-primary-200 transition-colors">
              Dashboard
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden focus:outline-none focus:ring-2 focus:ring-primary-300 rounded p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {menuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            <Link
              to="/"
              className="block hover:text-primary-200 transition-colors py-2"
              onClick={() => setMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              to="/senderos"
              className="block hover:text-primary-200 transition-colors py-2"
              onClick={() => setMenuOpen(false)}
            >
              Senderos
            </Link>
            <Link
              to="/reservas/nueva"
              className="block hover:text-primary-200 transition-colors py-2"
              onClick={() => setMenuOpen(false)}
            >
              Reservar
            </Link>
            <Link
              to="/reservas/consultar"
              className="block hover:text-primary-200 transition-colors py-2"
              onClick={() => setMenuOpen(false)}
            >
              Consultar Reserva
            </Link>
            <Link
              to="/dashboard"
              className="block hover:text-primary-200 transition-colors py-2"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};
