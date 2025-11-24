import { Badge, Card, DificultadBadge } from '@/components/common';
import {
    Clock,
    Info,
    Map,
    MapPin,
    Mountain,
    TrendingUp, Users
} from 'lucide-react';

const SenderoDetail = ({ sendero }) => {
    const {
        nombre,
        descripcion,
        dificultad,
        duracionHoras,
        distanciaKm,
        cupoMaximoDia,
        imagenUrl,
        estado
    } = sendero;

    const detalles = [
        {
            icon: Clock,
            label: 'Duración',
            value: `${duracionHoras} horas`
        },
        {
            icon: TrendingUp,
            label: 'Distancia',
            value: `${distanciaKm} km`
        },
        {
            icon: Users,
            label: 'Cupo máximo diario',
            value: `${cupoMaximoDia} personas`
        },
        {
            icon: Mountain,
            label: 'Dificultad',
            value: <DificultadBadge dificultad={dificultad} />
        }
    ];

    return (
        <div className="space-y-6">
            {/* Imagen principal */}
            <div className="relative h-96 rounded-xl overflow-hidden bg-gradient-to-br from-primary-400 to-primary-600">
                {imagenUrl ? (
                    <img
                        src={imagenUrl}
                        alt={nombre}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <MapPin className="w-32 h-32 text-white/30" />
                    </div>
                )}

                {/* Overlay con título */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-8 w-full">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl font-bold text-white">{nombre}</h1>
                            {estado !== 'ACTIVO' && (
                                <Badge variant="gray">{estado}</Badge>
                            )}
                        </div>
                        <DificultadBadge dificultad={dificultad} />
                    </div>
                </div>
            </div>

            {/* Detalles del sendero */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {detalles.map((detalle, index) => {
                    const Icon = detalle.icon;
                    return (
                        <Card key={index}>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {detalle.label}
                                    </p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {detalle.value}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Descripción */}
            <Card>
                <div className="flex items-start gap-3 mb-4">
                    <Info className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Descripción
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {descripcion}
                        </p>
                    </div>
                </div>
            </Card>

            {/* Información adicional */}
            <Card className="bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
                <div className="flex items-start gap-3">
                    <Map className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-semibold text-primary-900 dark:text-primary-100 mb-2">
                            Recomendaciones
                        </h3>
                        <ul className="space-y-2 text-sm text-primary-800 dark:text-primary-200">
                            <li>• Lleva agua suficiente para toda la duración del recorrido</li>
                            <li>• Usa calzado cómodo y adecuado para senderismo</li>
                            <li>• Lleva protector solar y repelente de insectos</li>
                            <li>• Respeta la flora y fauna del lugar</li>
                            <li>• No dejes basura en el sendero</li>
                        </ul>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default SenderoDetail;
