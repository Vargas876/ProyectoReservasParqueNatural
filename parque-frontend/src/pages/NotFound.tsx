import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <Card>
          <div className="text-center">
            <div className="text-9xl font-bold text-primary-600 mb-4">404</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Página no encontrada</h1>
            <p className="text-gray-600 text-lg mb-8">
              Lo sentimos, la página que buscas no existe o ha sido movida.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/')}>Volver al Inicio</Button>
              <Button variant="outline" onClick={() => navigate(-1)}>
                Volver Atrás
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default NotFound;

