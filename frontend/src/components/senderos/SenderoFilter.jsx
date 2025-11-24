import { Button, Input, Select } from '@/components/common';
import { DIFICULTADES } from '@/utils/constants';
import { Filter, Search, X } from 'lucide-react';
import { useState } from 'react';

const SenderoFilter = ({ onFilter, onReset }) => {
    const [filters, setFilters] = useState({
        busqueda: '',
        dificultad: '',
        duracionMax: '',
        distanciaMax: ''
    });

    const [isExpanded, setIsExpanded] = useState(false);

    const dificultadOptions = [
        { value: '', label: 'Todas las dificultades' },
        ...Object.values(DIFICULTADES).map(value => ({
            value,
            label: value.charAt(0) + value.slice(1).toLowerCase()
        }))
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter(filters);
    };

    const handleReset = () => {
        setFilters({
            busqueda: '',
            dificultad: '',
            duracionMax: '',
            distanciaMax: ''
        });
        onReset();
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Búsqueda siempre visible */}
                <div className="flex gap-3">
                    <div className="flex-1">
                        <Input
                            name="busqueda"
                            value={filters.busqueda}
                            onChange={handleChange}
                            placeholder="Buscar por nombre..."
                            icon={Search}
                        />
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsExpanded(!isExpanded)}
                        icon={Filter}
                    >
                        {isExpanded ? 'Menos' : 'Más'} Filtros
                    </Button>

                    <Button type="submit" variant="primary">
                        Buscar
                    </Button>
                </div>

                {/* Filtros adicionales (colapsables) */}
                {isExpanded && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Select
                            label="Dificultad"
                            name="dificultad"
                            value={filters.dificultad}
                            onChange={handleChange}
                            options={dificultadOptions}
                        />

                        <Input
                            label="Duración máxima (horas)"
                            name="duracionMax"
                            type="number"
                            step="0.5"
                            min="0"
                            value={filters.duracionMax}
                            onChange={handleChange}
                            placeholder="Ej: 4"
                        />

                        <Input
                            label="Distancia máxima (km)"
                            name="distanciaMax"
                            type="number"
                            step="0.1"
                            min="0"
                            value={filters.distanciaMax}
                            onChange={handleChange}
                            placeholder="Ej: 10"
                        />
                    </div>
                )}

                {/* Botón de resetear filtros */}
                {hasActiveFilters && (
                    <div className="flex justify-end pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleReset}
                            icon={X}
                            size="small"
                        >
                            Limpiar filtros
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default SenderoFilter;
