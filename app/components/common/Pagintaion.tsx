import React from 'react';

interface PaginationProps {
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
}

function Pagination({
    currentPage = 1,
    totalPages = 1,
    onPageChange = () => {},
}: PaginationProps) {
    const maxPagesToShow = 10; // Adjust this value as needed

    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (totalPages - startPage + 1 <= maxPagesToShow) {
        // Adjust the range if there are not enough pages to display
        startPage = Math.max(1, endPage - maxPagesToShow);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <nav aria-label="Page navigation example">
            <ul className="flex items-center -space-x-px h-8 text-sm">
                <li>
                    <button
                        type="button"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg lg:hover:bg-gray-100 lg:hover:text-gray-700"
                    >
                        <span className="sr-only">Previous</span>
                        <svg
                            className="w-2.5 h-2.5 rtl:rotate-180"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 6 10"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 1 1 5l4 4"
                            />
                        </svg>
                    </button>
                </li>
                {pages.map((page) => (
                    <li key={page}>
                        <button
                            type="button"
                            onClick={() => onPageChange(page)}
                            className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 ${
                                currentPage === page
                                    ? 'text-white border-blue-300 bg-orange-400 lg:hover:bg-orange-400'
                                    : 'lg:hover:bg-gray-100 lg:hover:text-gray-700'
                            }`}
                        >
                            {page}
                        </button>
                    </li>
                ))}
                {totalPages > endPage + 1 && (
                    <li>
                        <span className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300">
                            ...
                        </span>
                    </li>
                )}
                {totalPages !== pages[pages.length - 1] && (
                    <li>
                        <button
                            type="button"
                            onClick={() => onPageChange(totalPages)}
                            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 lg:hover:bg-gray-100 lg:hover:text-gray-700"
                        >
                            {totalPages}
                        </button>
                    </li>
                )}
                <li>
                    <button
                        type="button"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg lg:hover:bg-gray-100 lg:hover:text-gray-700"
                    >
                        <span className="sr-only">Next</span>
                        <svg
                            className="w-2.5 h-2.5 rtl:rotate-180"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 6 10"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="m1 9 4-4-4-4"
                            />
                        </svg>
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default Pagination;
