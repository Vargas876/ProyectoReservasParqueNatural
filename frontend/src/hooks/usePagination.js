import { useMemo, useState } from 'react';

/**
 * Hook para manejar paginación
 * @param {Array} data - Datos a paginar
 * @param {number} itemsPerPage - Elementos por página (default: 10)
 * @returns {Object} Estado y funciones de paginación
 */
export const usePagination = (data = [], itemsPerPage = 10) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const currentData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * itemsPerPage;
        const lastPageIndex = firstPageIndex + itemsPerPage;
        return data.slice(firstPageIndex, lastPageIndex);
    }, [data, currentPage, itemsPerPage]);

    const goToPage = (page) => {
        const pageNumber = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(pageNumber);
    };

    const nextPage = () => {
        goToPage(currentPage + 1);
    };

    const prevPage = () => {
        goToPage(currentPage - 1);
    };

    const reset = () => {
        setCurrentPage(1);
    };

    return {
        currentPage,
        totalPages,
        currentData,
        goToPage,
        nextPage,
        prevPage,
        reset,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1
    };
};
