import { Card, DificultadBadge } from '@/components/common';
import { Clock, MapPin, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const SenderoCard = ({ sendero, showActions = false, onEdit, onDelete }) => {
    const {
        idSendero,
        nombre,
        descripcion,
        dificultad,
        duracionHoras,
        distanciaKm,
        cupoMaximoDia,
        imagenUrl,
        estado
    } = sendero;

    return (
        <Card hoverable className="overflow-hidden">
            {/* Imagen */}
            <div className="relative h-48 bg-gradient-to-br from-primary-400 to-primary-600">
                {imagenUrl ? (
                    <img
                        src={imagenUrl}
                        alt={nombre}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <MapPin className="w-16 h-16 text-white/30" />
                    </div>
                )}

                {/* Badge de dificultad */}
                <div className="absolute top-3 right-3">
                    <DificultadBadge dificultad={dificultad} />
                </div>

                {/* Badge de estado (solo para admin) */}
                {showActions && estado !== 'ACTIVO' && (
                    <div className="absolute top-3 left-3">
                        <span className="badge badge-gray">
                            {estado}
                        </span>
                    </div>
                )}
            </div>

            {/* Contenido */}
            <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {nombre}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {descripcion}
                </p>

                {/* Detalles */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4 text-primary-500" />
                        <span>{duracionHoras} hrs</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <TrendingUp className="w-4 h-4 text-primary-500" />
                        <span>{distanciaKm} km</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4 text-primary-500" />
                        <span>Hasta {cupoMaximoDia} personas/día</span>
                    </div>
                </div>

                {/* Acciones */}
                {showActions ? (
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(sendero)}
                            className="btn btn-outline flex-1"
                        >
                            Editar
                        </button>
                        <button
                            onClick={() => onDelete(sendero)}
                            className="btn btn-danger flex-1"
                        >
                            Eliminar
                        </button>
                    </div>
                ) : (
                    <Link
                        to={`/senderos/${idSendero}`}
                        className="btn btn-primary w-full"
                    >
                        Ver Detalles
                    </Link>
                )}
            </div>
        </Card>
    );
};

export default SenderoCard;
