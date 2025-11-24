import { Badge, Card, EmptyState, Input } from '@/components/common';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Edit2, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

const UsuariosTable = ({
    usuarios = [],
    onEdit,
    onDelete,
    tipo = 'visitante' // 'visitante' o 'guia'
}) => {
    const [busqueda, setBusqueda] = useState('');
    const [menuAbierto, setMenuAbierto] = useState(null);

    const usuariosFiltrados = usuarios.filter(usuario => {
        const termino = busqueda.toLowerCase();
        const nombreCompleto = `${usuario.nombre} ${usuario.apellido}`.toLowerCase();
        return nombreCompleto.includes(termino) ||
            usuario.email.toLowerCase().includes(termino) ||
            usuario.cedula.includes(termino);
    });

    if (usuarios.length === 0) {
        return (
            <Card>
                <EmptyState
                    title={`No hay ${tipo}s registrados`}
                    description={`Aún no se han registrado ${tipo}s en el sistema.`}
                />
            </Card>
        );
    }

    return (
        <Card>
            {/* Header con búsqueda */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {tipo === 'visitante' ? 'Visitantes' : 'Guías'} ({usuariosFiltrados.length})
                </h3>
                <div className="w-64">
                    <Input
                        placeholder="Buscar..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        icon={Search}
                    />
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Usuario
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Contacto
                            </th>
                            {tipo === 'guia' && (
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Especialidades
                                </th>
                            )}
                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Estado
                            </th>
                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Registro
                            </th>
                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuariosFiltrados.map((usuario) => (
                            <tr
                                key={usuario.idUsuario}
                                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                {/* Usuario */}
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
                                            {usuario.nombre.charAt(0)}{usuario.apellido.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {usuario.nombre} {usuario.apellido}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                CC: {usuario.cedula}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                {/* Contacto */}
                                <td className="py-3 px-4">
                                    <p className="text-sm text-gray-900 dark:text-white">
                                        {usuario.email}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {usuario.telefono}
                                    </p>
                                </td>

                                {/* Especialidades (solo guías) */}
                                {tipo === 'guia' && (
                                    <td className="py-3 px-4">
                                        <div className="flex flex-wrap gap-1">
                                            {usuario.especialidades?.split(',').slice(0, 2).map((esp, i) => (
                                                <Badge key={i} variant="primary" size="small">
                                                    {esp.trim()}
                                                </Badge>
                                            ))}
                                        </div>
                                    </td>
                                )}

                                {/* Estado */}
                                <td className="py-3 px-4 text-center">
                                    <Badge variant={usuario.estado === 'ACTIVO' ? 'success' : 'gray'}>
                                        {usuario.estado}
                                    </Badge>
                                </td>

                                {/* Fecha de registro */}
                                <td className="py-3 px-4 text-center text-sm text-gray-600 dark:text-gray-400">
                                    {usuario.fechaRegistro ?
                                        format(new Date(usuario.fechaRegistro), 'd MMM yyyy', { locale: es }) :
                                        'N/A'
                                    }
                                </td>

                                {/* Acciones */}
                                <td className="py-3 px-4">
                                    <div className="flex items-center justify-center gap-2">
                                        {onEdit && (
                                            <button
                                                onClick={() => onEdit(usuario)}
                                                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 transition-colors"
                                                title="Editar"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                onClick={() => onDelete(usuario)}
                                                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Sin resultados */}
            {usuariosFiltrados.length === 0 && busqueda && (
                <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">
                        No se encontraron resultados para "{busqueda}"
                    </p>
                </div>
            )}
        </Card>
    );
};

export default UsuariosTable;
