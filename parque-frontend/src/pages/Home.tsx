import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-primary-700 mb-4">
              🌲 Bienvenido al Parque Natural 🌲
            </h1>
            <p className="text-xl text-gray-700">
              Sistema de Gestión de Reservas de Senderos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            <div className="card hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🥾</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Explora Senderos
              </h3>
              <p className="text-gray-600">
                Descubre rutas de diferentes niveles de dificultad
              </p>
            </div>

            <div className="card hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Reserva Fácil
              </h3>
              <p className="text-gray-600">
                Reserva tu visita en pocos pasos
              </p>
            </div>

            <div className="card hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🧑‍🏫</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Guías Expertos
              </h3>
              <p className="text-gray-600">
                Recorridos con guías especializados
              </p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/senderos')}
              className="btn-primary text-lg px-8 py-3"
            >
              Ver Senderos Disponibles
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
