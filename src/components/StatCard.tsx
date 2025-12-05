import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: LucideIcon;
  format?: 'number' | 'currency' | 'percent';
  className?: string;
}

const StatCard = ({
  label,
  value,
  change,
  icon: Icon,
  format = 'number',
  className,
}: StatCardProps) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;
    switch (format) {
      case 'currency':
        // --- START OF CHANGE: Updated currency to NGN ---
        return new Intl.NumberFormat('en-NG', {
          // 'en-NG' locale for Nigeria
          style: 'currency',
          currency: 'NGN', // Nigerian Naira currency code
          // Note: NGN typically has 0 decimal places for whole numbers
          minimumFractionDigits: 0,
        }).format(val);
      // --- END OF CHANGE ---
      case 'percent':
        return `${val}%`;
      default:
        return val.toLocaleString();
    }
  };

  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  const isNeutral = change === 0;

  return (
    <div className={cn('hotel-stat-card animate-fade-in', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm font-medium">{label}</p>
          <p className="text-foreground text-3xl font-semibold tracking-tight">
            {formatValue(value)}
          </p>
        </div>
        {Icon && (
          <div className="bg-secondary rounded-lg p-2">
            <Icon className="text-muted-foreground h-5 w-5" />
          </div>
        )}
      </div>

      {change !== undefined && (
        <div className="mt-4 flex items-center gap-1.5">
          {isPositive && <TrendingUp className="text-success h-4 w-4" />}
          {isNegative && <TrendingDown className="text-destructive h-4 w-4" />}
          {isNeutral && <Minus className="text-muted-foreground h-4 w-4" />}
          <span
            className={cn(
              'text-sm font-medium',
              isPositive && 'text-success',
              isNegative && 'text-destructive',
              isNeutral && 'text-muted-foreground'
            )}
          >
            {isPositive && '+'}
            {change}%
          </span>
          <span className="text-muted-foreground text-sm">vs last week</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
