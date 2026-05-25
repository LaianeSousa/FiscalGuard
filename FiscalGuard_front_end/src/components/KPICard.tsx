import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  suffix?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  icon: Icon,
  title,
  value,
  subtitle,
  trend,
  suffix = '',
}) => {
  const isPositive = trend && trend > 0;

  return (
    <div className="bg-[#12121A] border border-[#1E1E2E] rounded-xl p-6 hover:border-[#8B5CF6]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#8B5CF6]/10">
      <div className="flex items-start justify-between mb-4">
        <div className="bg-[#8B5CF6]/10 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-[#8B5CF6]" />
        </div>
        {trend !== undefined && (
          <div
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              isPositive
                ? 'bg-green-500/10 text-[#10B981]'
                : 'bg-red-500/10 text-red-500'
            }`}
          >
            {isPositive ? '+' : ''}{trend.toFixed(1)}%
          </div>
        )}
      </div>

      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-white text-3xl font-bold mb-2">
          {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
          <span className="text-lg text-gray-500 ml-2">{suffix}</span>
        </h3>
        {subtitle && <p className="text-gray-500 text-xs">{subtitle}</p>}
      </div>
    </div>
  );
};
