const Spinner = ({ size = 'default', className = '' }) => {
    const sizeClasses = {
        small: 'w-4 h-4 border-2',
        default: 'w-8 h-8 border-3',
        large: 'w-12 h-12 border-4'
    };

    return (
        <div
            className={`
        ${sizeClasses[size]} 
        border-gray-200 border-t-primary-600 
        rounded-full animate-spin
        ${className}
      `}
        />
    );
};

export default Spinner;
