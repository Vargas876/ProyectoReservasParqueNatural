import { EmptyState, Input } from '@/components/common';
import { Search, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { GuiaCard } from './';

const GuiaSelector = ({ guias = [], onSelect, selectedGuia = null }) => {
    const [busqueda, setBusqueda] = useState('');
    const [guiasFiltrados, setGuiasFiltrados] = useState(guias);

    useEffect(() => {
        if (!busqueda.trim()) {
            setGuiasFiltrados(guias);
            return;
        }

        const filtrados = guias.filter(guia => {
            const nombreCompleto = `${guia.nombre} ${guia.apellido}`.toLowerCase();
            const especialidades = guia.especialidades?.toLowerCase() || '';
            const termino = busqueda.toLowerCase();

            return nombreCompleto.includes(termino) || especialidades.includes(termino);
        });

        setGuiasFiltrados(filtrados);
    }, [busqueda, guias]);

    return (
        <div className="space-y-4">
            {/* Buscador */}
            <Input
                placeholder="Buscar guía por nombre o especialidad..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                icon={Search}
            />

            {/* Lista de guías */}
            {guiasFiltrados.length === 0 ? (
                <EmptyState
                    icon={Users}
                    title="No se encontraron guías"
                    description="Intenta con otra búsqueda"
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {guiasFiltrados.map((guia) => (
                        <div
                            key={guia.idUsuario || guia.id} // ⭐ AÑADIR KEY
                            onClick={() => onSelect(guia)}
                            className={`
                cursor-pointer transition-all duration-200
                ${selectedGuia?.idUsuario === guia.idUsuario
                                    ? 'ring-2 ring-primary-500 scale-105'
                                    : 'hover:ring-2 hover:ring-gray-300'
                                }
              `}
                        >
                            <GuiaCard
                                guia={guia}
                                showActions={false}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GuiaSelector;
