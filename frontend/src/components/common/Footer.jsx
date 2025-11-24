import { Facebook, Instagram, Mail, Map, Phone, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo y descripción */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <Map className="w-8 h-8 text-primary-500" />
                            <span className="text-xl font-bold text-white">
                                Parque Natural
                            </span>
                        </div>
                        <p className="text-gray-400 mb-4">
                            Sistema de reservas para tu próxima aventura en la naturaleza.
                            Descubre senderos, reserva tu visita y vive experiencias únicas.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="#"
                                className="p-2 rounded-full bg-gray-800 hover:bg-primary-600 transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="p-2 rounded-full bg-gray-800 hover:bg-primary-600 transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="p-2 rounded-full bg-gray-800 hover:bg-primary-600 transition-colors"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Enlaces rápidos */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Enlaces Rápidos</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="hover:text-primary-400 transition-colors">
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link to="/senderos" className="hover:text-primary-400 transition-colors">
                                    Senderos
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="hover:text-primary-400 transition-colors">
                                    Registrarse
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="hover:text-primary-400 transition-colors">
                                    Iniciar Sesión
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Contacto</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2">
                                <Mail className="w-5 h-5 text-primary-500" />
                                <a href="mailto:info@parquenatural.com" className="hover:text-primary-400">
                                    info@parquenatural.com
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-5 h-5 text-primary-500" />
                                <a href="tel:+573001234567" className="hover:text-primary-400">
                                    +57 300 123 4567
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>
                        &copy; {currentYear} Parque Natural. Todos los derechos reservados.
                    </p>
                    <p className="mt-2 text-sm">
                        Desarrollado por <span className="text-primary-500">UPTC - Bases de Datos 2</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
