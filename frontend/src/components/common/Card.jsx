const Card = ({
    children,
    className = '',
    hoverable = false,
    onClick,
    ...props
}) => {
    return (
        <div
            className={`
        card
        ${hoverable ? 'cursor-pointer hover:shadow-xl' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
