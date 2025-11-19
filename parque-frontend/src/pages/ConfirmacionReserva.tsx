import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

const ConfirmacionReserva: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const codigo = searchParams.get('codigo');

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Reserva Confirmada!
            </h1>
            <p className="text-gray-600 mb-6">
              Tu reserva ha sido procesada exitosamente
            </p>
            
            {codigo && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <p className="text-sm text-gray-600 mb-2">ID de Reserva</p>
                <p className="text-2xl font-bold text-primary-700 font-mono">
                  {codigo}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Guarda este número para consultar tu reserva más tarde
                </p>
              </div>
            )}

            <div className="space-y-4">
              <p className="text-gray-700">
                Recibirás un correo electrónico con los detalles de tu reserva.
              </p>
              <p className="text-gray-700">
                Te esperamos en el parque para disfrutar de esta experiencia única.
              </p>
            </div>

            <div className="flex gap-4 mt-8 justify-center">
              <Button onClick={() => navigate('/senderos')}>
                Ver Más Senderos
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Volver al Inicio
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ConfirmacionReserva;

