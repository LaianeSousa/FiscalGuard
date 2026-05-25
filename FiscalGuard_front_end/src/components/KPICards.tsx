import React from 'react';
import { DollarSign, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface KPICardsProps {
  faturamentoBruto: number;
  pisAPagar: number;
  cofinsAPagar: number;
  scoreConformidade: number;
  loading?: boolean;
}

const KPICards: React.FC<KPICardsProps> = ({
  faturamentoBruto = 0,
  pisAPagar = 0,
  cofinsAPagar = 0,
  scoreConformidade = 100,
  loading = false
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const KPICard = ({
    title,
    value,
    icon: Icon,
    isPercentage = false,
  }: {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    isPercentage?: boolean;
  }) => (
    <div className="bg-[#12121A] border border-purple-900/20 rounded-2xl p-6 hover:border-purple-700/40 transition-all duration-300 backdrop-blur-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium mb-2">{title}</p>
          <div className="flex items-baseline gap-2">
            {typeof value === 'number' ? (
              <>
                <span className="text-2xl md:text-3xl font-bold text-white">
                  {isPercentage ? `${Math.round(value)}%` : formatCurrency(value)}
                </span>
              </>
            ) : (
              <span className="text-2xl md:text-3xl font-bold text-white">{value}</span>
            )}
          </div>
        </div>
        <div className="text-purple-500 opacity-80">{Icon}</div>
      </div>
      <div className="mt-4 pt-4 border-t border-purple-900/10">
        <p className="text-xs text-gray-500">Período atual</p>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard
        title="Faturamento Bruto"
        value={faturamentoBruto}
        icon={<DollarSign className="w-6 h-6" />}
      />
      <KPICard
        title="PIS a Pagar"
        value={pisAPagar}
        icon={<TrendingUp className="w-6 h-6" />}
      />
      <KPICard
        title="COFINS a Pagar"
        value={cofinsAPagar}
        icon={<TrendingUp className="w-6 h-6" />}
      />
      <KPICard
        title="Score Conformidade"
        value={scoreConformidade}
        icon={
          scoreConformidade >= 80 ? (
            <CheckCircle className="w-6 h-6 text-green-500" />
          ) : (
            <AlertCircle className="w-6 h-6 text-yellow-500" />
          )
        }
        isPercentage
      />
    </div>
  );
};

export default KPICards;
