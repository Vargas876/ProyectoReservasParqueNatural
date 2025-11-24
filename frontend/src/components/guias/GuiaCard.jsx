import { Badge, Button, Card } from '@/components/common';
import { Award, Mail, MapPin, Phone, Star, Users } from 'lucide-react';

const GuiaCard = ({
    guia,
    onSelect,
    onEdit,
    onDelete,
    showActions = false,
    selectable = false,
    selected = false
}) => {
    const {
        idUsuario,
        nombre,
        apellido,
        email,
        telefono,
        especialidades,
        maxPersonasGrupo,
        numeroRecorridos,
        calificacionPromedio,
        estado
    } = guia;

    const nombreCompleto = `${nombre} ${apellido}`;

    return (
        <Card
            className={`
        ${selectable ? 'cursor-pointer hover:border-primary-500' : ''}
        ${selected ? 'border-2 border-primary-600 bg-primary-50 dark:bg-primary-900/10' : ''}
      `}
            onClick={selectable ? () => onSelect(guia) : undefined}
        >
            {/* Header con avatar y estado */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-lg">
                        {nombre.charAt(0)}{apellido.charAt(0)}
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {nombreCompleto}
                        </h3>
                        <Badge variant={estado === 'ACTIVO' ? 'success' : 'gray'} size="small">
                            {estado}
                        </Badge>
                    </div>
                </div>

                {/* Calificación */}
                {calificacionPromedio > 0 && (
                    <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                            {calificacionPromedio.toFixed(1)}
                        </span>
                    </div>
                )}
            </div>

            {/* Información de contacto */}
            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4 text-primary-600" />
                    <span className="truncate">{email}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4 text-primary-600" />
                    <span>{telefono}</span>
                </div>
            </div>

            {/* Especialidades */}
            {especialidades && (
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-primary-600" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Especialidades
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {especialidades.split(',').map((esp, index) => (
                            <Badge key={index} variant="primary" size="small">
                                {esp.trim()}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* Estadísticas */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg mb-4">
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
                        <MapPin className="w-4 h-4" />
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {numeroRecorridos || 0}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        Recorridos
                    </p>
                </div>

                <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
                        <Users className="w-4 h-4" />
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {maxPersonasGrupo}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        Máx. Personas
                    </p>
                </div>
            </div>

            {/* Acciones */}
            {showActions && (
                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {onEdit && (
                        <Button
                            variant="outline"
                            size="small"
                            onClick={() => onEdit(guia)}
                            className="flex-1"
                        >
                            Editar
                        </Button>
                    )}
                    {onDelete && (
                        <Button
                            variant="danger"
                            size="small"
                            onClick={() => onDelete(guia)}
                            className="flex-1"
                        >
                            Eliminar
                        </Button>
                    )}
                </div>
            )}

            {/* Indicador de selección */}
            {selected && (
                <div className="mt-4 p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-center">
                    <p className="text-sm font-medium text-primary-700 dark:text-primary-300">
                        ✓ Guía Seleccionado
                    </p>
                </div>
            )}
        </Card>
    );
};

export default GuiaCard;
