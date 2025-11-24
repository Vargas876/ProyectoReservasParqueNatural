import { EmptyState, Loader } from '@/components/common';
import { Map } from 'lucide-react';
import SenderoCard from './SenderoCard';

const SenderoList = ({
    senderos = [],
    loading = false,
    showActions = false,
    onEdit,
    onDelete
}) => {
    if (loading) {
        return <Loader text="Cargando senderos..." />;
    }

    if (!senderos || senderos.length === 0) {
        return (
            <EmptyState
                icon={Map}
                title="No hay senderos disponibles"
                description="Aún no se han agregado senderos al sistema."
            />
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {senderos.map((sendero) => (
                <SenderoCard
                    key={sendero.idSendero}
                    sendero={sendero}
                    showActions={showActions}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default SenderoList;
