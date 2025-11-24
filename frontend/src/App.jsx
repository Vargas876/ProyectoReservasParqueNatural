import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import { Footer, Navbar } from '@/components/common';

// Routes
import { AppRoutes } from '@/routes';

function App() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            {/* Navbar global */}
            <Navbar />

            {/* Contenido principal con rutas */}
            <main className="flex-grow">
                <AppRoutes />
            </main>

            {/* Footer global */}
            <Footer />

            {/* Sistema de notificaciones toast */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                className="mt-16"
                toastClassName="shadow-lg"
            />
        </div>
    );
}

export default App;
