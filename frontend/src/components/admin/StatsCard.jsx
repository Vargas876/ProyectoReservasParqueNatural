import { Card } from '@/components/common';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';

const StatsCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    subtitle,
    variant = 'default'
}) => {
    const variants = {
        default: 'from-primary-400 to-primary-600',
        success: 'from-green-400 to-green-600',
        warning: 'from-yellow-400 to-yellow-600',
        danger: 'from-red-400 to-red-600',
        info: 'from-blue-400 to-blue-600'
    };

    const getTrendIcon = () => {
        if (trend === 'up') return <TrendingUp className="w-4 h-4" />;
        if (trend === 'down') return <TrendingDown className="w-4 h-4" />;
        return <Minus className="w-4 h-4" />;
    };

    const getTrendColor = () => {
        if (trend === 'up') return 'text-green-600 dark:text-green-400';
        if (trend === 'down') return 'text-red-600 dark:text-red-400';
        return 'text-gray-600 dark:text-gray-400';
    };

    return (
        <Card className="overflow-hidden">
            <div className="flex items-start justify-between">
                {/* Contenido */}
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {value}
                    </p>

                    {/* Tendencia o subtítulo */}
                    {(trend || subtitle) && (
                        <div className="flex items-center gap-2">
                            {trend && trendValue && (
                                <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
                                    {getTrendIcon()}
                                    <span>{trendValue}</span>
                                </div>
                            )}
                            {subtitle && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Icono */}
                {Icon && (
                    <div className={`
            w-12 h-12 rounded-lg bg-gradient-to-br ${variants[variant]}
            flex items-center justify-center text-white
          `}>
                        <Icon className="w-6 h-6" />
                    </div>
                )}
            </div>
        </Card>
    );
};

export default StatsCard;
