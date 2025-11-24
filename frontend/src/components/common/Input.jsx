const Input = ({
    label,
    error,
    icon: Icon,
    className = '',
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                    {props.required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <Icon className="w-5 h-5 text-gray-400" />
                    </div>
                )}

                <input
                    className={`
            input
            ${Icon ? 'pl-10' : ''}
            ${error ? 'input-error' : ''}
            ${className}
          `}
                    {...props}
                />
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
