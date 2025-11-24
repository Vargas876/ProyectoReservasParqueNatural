import { EmptyState } from '@/components/common';
import { Users } from 'lucide-react';
import { GuiaCard } from './';

const GuiaList = ({ guias = [], loading = false, showActions = false, onEdit, onDelete }) => {
    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="spinner mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Cargando guías...</p>
            </div>
        );
    }

    if (guias.length === 0) {
        return (
            <EmptyState
                icon={Users}
                title="No hay guías disponibles"
                description="Aún no se han registrado guías en el sistema."
            />
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guias.map((guia) => (
                <GuiaCard
                    key={guia.idUsuario || guia.id} // ⭐ AÑADIR KEY
                    guia={guia}
                    showActions={showActions}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default GuiaList;
