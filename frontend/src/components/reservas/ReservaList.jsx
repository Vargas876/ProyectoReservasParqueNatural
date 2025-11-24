import { EmptyState, Loader } from '@/components/common';
import { Calendar } from 'lucide-react';
import ReservaCard from './ReservaCard';

const ReservaList = ({
    reservas = [],
    loading = false,
    onEdit,
    onCancel,
    onConfirmar,
    showActions = true,
    showVisitante = false,
    showGuia = false,
    emptyMessage = 'No hay reservas disponibles'
}) => {
    if (loading) {
        return <Loader text="Cargando reservas..." />;
    }

    if (!reservas || reservas.length === 0) {
        return (
            <EmptyState
                icon={Calendar}
                title={emptyMessage}
                description="Aún no se han creado reservas."
            />
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservas.map((reserva) => (
                <ReservaCard
                    key={reserva.idReserva}
                    reserva={reserva}
                    onEdit={onEdit}
                    onCancel={onCancel}
                    onConfirmar={onConfirmar}
                    showActions={showActions}
                    showVisitante={showVisitante}
                    showGuia={showGuia}
                />
            ))}
        </div>
    );
};

export default ReservaList;
