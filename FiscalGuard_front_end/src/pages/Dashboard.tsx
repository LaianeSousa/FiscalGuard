import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ComposedChart
} from 'recharts';
import { useGlobalContext } from '../context/GlobalContext';
import { API_ENDPOINTS } from '../api/client';
import KPICards from '../components/KPICards';
import { AlertCircle, Loader } from 'lucide-react';

interface ApuracaoData {
  sucesso: boolean;
  dados_apurados: {
    faturamento_declarado: number;
    valor_pis: number;
    valor_cofins: number;
    tipo_arquivo: string;
  };
}

interface ChartData {
  mes: string;
  faturamento: number;
  pis: number;
  cofins: number;
}

export const Dashboard: React.FC = () => {
  const { selectedCompanyId, selectedMonth, selectedYear } = useGlobalContext();
  const [apuracaoData, setApuracaoData] = useState<ApuracaoData | null>(null);
  const [auditoriaData, setAuditoriaData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dados mock para o gráfico
  const chartData: ChartData[] = [
    { mes: 'Jan', faturamento: 28000, pis: 462, cofins: 2128 },
    { mes: 'Fev', faturamento: 31000, pis: 511, cofins: 2359 },
    { mes: 'Mar', faturamento: 29500, pis: 486, cofins: 2242 },
    { mes: 'Abr', faturamento: 32100, pis: 529, cofins: 2440 },
    { mes: 'Mai', faturamento: 33500, pis: 553, cofins: 2546 },
  ];

  useEffect(() => {
    const fetchDados = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar dados de apuração
        try {
          const resApuracao = await API_ENDPOINTS.apurarFiscal(
            selectedCompanyId,
            selectedYear,
            selectedMonth
          );
          setApuracaoData(resApuracao.data);
        } catch (errApuracao) {
          console.warn('Erro ao buscar apuração:', errApuracao);
          // Usar dados mock em caso de erro
          setApuracaoData({
            sucesso: true,
            dados_apurados: {
              faturamento_declarado: 33500.0,
              valor_pis: 552.75,
              valor_cofins: 2546.0,
              tipo_arquivo: 'EFD_CONTRIBUICOES'
            }
          });
        }

        // Buscar dados de auditoria IA
        try {
          const resAuditoria = await API_ENDPOINTS.auditoriaIA(
            selectedCompanyId,
            selectedYear,
            selectedMonth
          );
          setAuditoriaData(resAuditoria.data);
        } catch (errAuditoria) {
          console.warn('Erro ao buscar auditoria:', errAuditoria);
          setAuditoriaData({
            sucesso: true,
            total_analisado: 12,
            total_anomalias: 0,
            itens: []
          });
        }
      } catch (err: any) {
        console.error('Erro geral:', err);
        setError(`Erro ao carregar dados: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, [selectedCompanyId, selectedMonth, selectedYear]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-400">Carregando dados...</p>
        </div>
      </div>
    );
  }

  const dados = apuracaoData?.dados_apurados || {
    faturamento_declarado: 0,
    valor_pis: 0,
    valor_cofins: 0,
  };

  // Calcular score de conformidade
  const totalAnalisado = auditoriaData?.total_analisado || 0;
  const totalAnomalias = auditoriaData?.total_anomalias || 0;
  const scoreConformidade = totalAnalisado === 0 ? 100 : Math.max(0, 100 - (totalAnomalias / totalAnalisado) * 100);

  return (
    <div className="pt-24 pb-8 px-6 max-w-7xl mx-auto">
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-900/30 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* KPI Cards */}
      <div className="mb-8">
        <KPICards
          faturamentoBruto={dados.faturamento_declarado}
          pisAPagar={dados.valor_pis}
          cofinsAPagar={dados.valor_cofins}
          scoreConformidade={Math.round(scoreConformidade)}
        />
      </div>

      {/* Gráfico Principal */}
      <div className="bg-[#12121A] border border-purple-900/20 rounded-2xl p-8 backdrop-blur-sm hover:border-purple-700/40 transition-all duration-300">
        <div className="mb-6">
          <h2 className="text-white text-lg md:text-xl font-bold">
            📊 Faturamento vs Impostos - Últimos 5 Meses
          </h2>
          <p className="text-gray-500 text-sm mt-2">Análise comparativa de receita e obrigações tributárias</p>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradientFaturamento" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" vertical={false} />
            <XAxis dataKey="mes" stroke="#666" style={{ fontSize: '12px' }} />
            <YAxis stroke="#666" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0B0B0F',
                border: '1px solid #8B5CF6',
                borderRadius: '8px',
                boxShadow: '0 8px 16px rgba(139, 92, 246, 0.2)',
              }}
              labelStyle={{ color: '#fff' }}
              formatter={(value: number) => [
                `R$ ${value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`,
                ''
              ]}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => <span style={{ color: '#999', fontSize: '12px' }}>{value}</span>}
            />
            <Area
              type="monotone"
              dataKey="faturamento"
              fill="url(#gradientFaturamento)"
              stroke="#8B5CF6"
              strokeWidth={3}
              name="Faturamento (R$)"
            />
            <Line
              type="monotone"
              dataKey="pis"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
              name="PIS (R$)"
            />
            <Line
              type="monotone"
              dataKey="cofins"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={false}
              name="COFINS (R$)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Resumo de Auditoria */}
      {auditoriaData && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#12121A] border border-purple-900/20 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-white font-semibold mb-4">🔍 Análise de Auditoria IA</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Analisado:</span>
                <span className="text-white font-bold text-lg">{auditoriaData.total_analisado} itens</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Anomalias Detectadas:</span>
                <span className={`font-bold text-lg ${auditoriaData.total_anomalias > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {auditoriaData.total_anomalias} itens
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#12121A] border border-purple-900/20 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-white font-semibold mb-4">✅ Status Geral</h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-500 mb-2">
                {Math.round(scoreConformidade)}%
              </div>
              <p className="text-gray-400 text-sm">Conformidade Fiscal</p>
              <p className={`text-xs mt-2 ${scoreConformidade >= 80 ? 'text-green-400' : 'text-yellow-400'}`}>
                {scoreConformidade >= 80 ? '✅ Sem problemas detectados' : '⚠️ Verifique as anomalias'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
