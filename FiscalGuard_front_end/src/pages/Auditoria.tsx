import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, X, DownloadCloud, Loader, AlertCircle } from 'lucide-react';
import { API_ENDPOINTS } from '../api/client';
import { useGlobalContext } from '../context/GlobalContext';

interface AuditoriaItem {
  produto: string;
  codigo: string;
  ncm: string;
  cst_pis: string;
  valor_unitario: number;
  quantidade?: number;
  valor_total_item?: number;
  is_anomalia: boolean;
  score_bizarrice: number;
}

interface DrawerItem extends AuditoriaItem {
  id: string;
}

interface AuditoriaResponse {
  sucesso: boolean;
  total_analisado: number;
  total_anomalias: number;
  itens: AuditoriaItem[];
}

export const Auditoria: React.FC = () => {
  const { selectedCompanyId, selectedMonth, selectedYear } = useGlobalContext();
  const [auditoria, setAuditoria] = useState<AuditoriaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<DrawerItem | null>(null);
  const [ignoredAnomalies, setIgnoredAnomalies] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchAuditoria = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(`🔍 Buscando auditoria: empresa_id=${selectedCompanyId}, ano=${selectedYear}, mes=${selectedMonth}`);
        
        const response = await API_ENDPOINTS.auditoriaIA(selectedCompanyId, selectedYear, selectedMonth);
        
        console.log('✅ Auditoria recebida:', response.data);
        setAuditoria(response.data);
      } catch (err: any) {
        const errorMsg = err?.response?.data?.detail || err.message || 'Erro desconhecido';
        console.error('❌ Erro ao buscar auditoria:', errorMsg);
        
        // Se for erro 500, mostrar mensagem mas usar dados mock
        if (err?.response?.status === 500) {
          setError(`Erro no servidor (500): ${errorMsg}. Mostrando dados de exemplo...`);
        } else {
          setError(`Erro ao carregar auditoria: ${errorMsg}`);
        }
        
        // Usar dados mock como fallback
        setAuditoria({
          sucesso: true,
          total_analisado: 4,
          total_anomalias: 1,
          itens: [
            {
              produto: 'NOTEBOOK PRO I9 32GB',
              codigo: 'PROD001',
              ncm: '8471.30.10',
              cst_pis: '01',
              valor_unitario: 7500.0,
              is_anomalia: false,
              score_bizarrice: 0.2145,
            },
            {
              produto: 'MONITOR 34 CURVO',
              codigo: 'PROD002',
              ncm: '8528.72.90',
              cst_pis: '01',
              valor_unitario: 2500.0,
              is_anomalia: false,
              score_bizarrice: 0.3567,
            },
            {
              produto: 'TECLADO MECÂNICO RGB',
              codigo: 'PROD003',
              ncm: '8471.60.90',
              cst_pis: '01',
              valor_unitario: 450.0,
              is_anomalia: true,
              score_bizarrice: -0.6085,
            },
            {
              produto: 'MOUSE ÓPTICO',
              codigo: 'PROD004',
              ncm: '8471.60.90',
              cst_pis: '01',
              valor_unitario: 150.0,
              is_anomalia: false,
              score_bizarrice: 0.1234,
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAuditoria();
  }, [selectedCompanyId, selectedMonth, selectedYear]);

  const handleIgnoreAnomaly = (itemId: string) => {
    setIgnoredAnomalies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleExportReport = () => {
    if (!selectedItem) return;
    console.log('Exportando relatório para:', selectedItem);
    // TODO: Implementar exportação de PDF
  };

  if (loading) {
    return (
      <div className="pt-24 flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-400">Analisando itens fiscais...</p>
        </div>
      </div>
    );
  }

  const itemsToDisplay = auditoria?.itens?.map((item, idx) => ({
    id: `item-${idx}`,
    ...item,
  })) || [];

  return (
    <div className="pt-24 pb-8 px-6 max-w-7xl mx-auto space-y-6">
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-900/30 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* SUMMARY STATS */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#12121A] border border-[#1E1E2E] rounded-xl p-4">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Total Analisado</p>
          <p className="text-white text-3xl font-bold">{auditoria?.total_analisado || 0}</p>
        </div>
        <div className="bg-[#12121A] border border-[#1E1E2E] rounded-xl p-4">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Anomalias Detectadas</p>
          <p className="text-red-400 text-3xl font-bold">{auditoria?.total_anomalias || 0}</p>
        </div>
        <div className="bg-[#12121A] border border-[#1E1E2E] rounded-xl p-4">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Taxa de Conformidade</p>
          <p className="text-[#10B981] text-3xl font-bold">
            {auditoria && auditoria.total_analisado > 0
              ? ((1 - auditoria.total_anomalias / auditoria.total_analisado) * 100).toFixed(1)
              : 0}%
          </p>
        </div>
      </div>

      {/* AUDIT TABLE */}
      <div className="bg-[#12121A] border border-[#1E1E2E] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E1E2E] bg-[#0B0B0F]/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400">Produto</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400">Código</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400">NCM</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400">CST PIS</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400">Valor Unit.</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400">Score Bizarrice</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400">Ação</th>
              </tr>
            </thead>
            <tbody>
              {itemsToDisplay.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="border-b border-[#1E1E2E] hover:bg-[#8B5CF6]/5 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    {item.is_anomalia ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-600/20 text-red-300 rounded-full text-xs font-semibold animate-pulse">
                        <AlertTriangle size={14} />
                        🚨 ANOMALIA
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#10B981]/20 text-[#10B981] rounded-full text-xs font-semibold">
                        <CheckCircle size={14} />
                        ✅ NORMAL
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300 font-medium">{item.produto}</td>
                  <td className="px-6 py-4 text-sm text-gray-400 font-mono">{item.codigo}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{item.ncm}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{item.cst_pis}</td>
                  <td className="px-6 py-4 text-sm text-gray-300 font-medium text-right">
                    R$ {item.valor_unitario.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm font-mono text-right font-bold ${
                      item.score_bizarrice < 0 ? 'text-red-400' : 'text-[#10B981]'
                    }`}
                  >
                    {item.score_bizarrice.toFixed(4)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item);
                      }}
                      className="px-3 py-1 bg-[#8B5CF6]/30 hover:bg-[#8B5CF6]/50 text-[#8B5CF6] text-xs font-medium rounded transition-colors"
                    >
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DRAWER - ITEM DETAILS */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          ></div>

          {/* DRAWER */}
          <div className="absolute right-0 top-0 h-full w-96 bg-[#12121A] border-l border-[#1E1E2E] shadow-2xl overflow-y-auto">
            {/* HEADER */}
            <div className="sticky top-0 px-6 py-4 border-b border-[#1E1E2E] bg-[#12121A] flex items-center justify-between">
              <h3 className="font-bold text-white">Detalhes da Análise</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-6 space-y-6">
              {/* ITEM INFO */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Informações do Item</h4>
                <div className="space-y-3 bg-[#8B5CF6]/10 rounded-lg p-4 border border-[#1E1E2E]">
                  <div>
                    <p className="text-xs text-gray-400">Produto</p>
                    <p className="text-white font-medium">{selectedItem.produto}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Código</p>
                    <p className="text-gray-300 font-mono">{selectedItem.codigo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">NCM</p>
                    <p className="text-gray-300">{selectedItem.ncm}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">CST PIS</p>
                    <p className="text-gray-300">{selectedItem.cst_pis}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Valor Unitário</p>
                    <p className="text-white font-medium">
                      R$ {selectedItem.valor_unitario.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* ANOMALY ANALYSIS */}
              {selectedItem.is_anomalia && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Análise da Anomalia</h4>
                  <div className="space-y-3 bg-red-900/20 rounded-lg p-4 border border-red-900/30">
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Score de Bizarrice</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-red-500 h-full"
                            style={{
                              width: `${Math.min(100, Math.abs(selectedItem.score_bizarrice) * 100)}%`,
                            }}
                          ></div>
                        </div>
                        <p className="text-red-400 font-bold font-mono text-sm">
                          {selectedItem.score_bizarrice.toFixed(4)}
                        </p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-red-900/30">
                      <p className="text-sm text-red-200 leading-relaxed">
                        Este item apresenta características suspeitas. O score negativo indica divergência significativa em relação aos padrões históricos da empresa.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ACTIONS */}
              <div className="space-y-3 pt-4 border-t border-[#1E1E2E]">
                {selectedItem.is_anomalia && (
                  <button
                    onClick={() => {
                      handleIgnoreAnomaly(selectedItem.id);
                      setSelectedItem(null);
                    }}
                    className={`w-full px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      ignoredAnomalies.has(selectedItem.id)
                        ? 'bg-[#10B981]/30 text-[#10B981] border border-[#10B981]/50'
                        : 'bg-gray-600/30 text-gray-300 border border-gray-600/50 hover:bg-gray-600/40'
                    }`}
                  >
                    {ignoredAnomalies.has(selectedItem.id)
                      ? '✓ Falso Positivo Marcado'
                      : 'Marcar como Falso Positivo'}
                  </button>
                )}
                <button
                  onClick={handleExportReport}
                  className="w-full px-4 py-2 bg-[#8B5CF6]/30 hover:bg-[#8B5CF6]/50 text-[#8B5CF6] border border-[#8B5CF6]/50 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <DownloadCloud size={16} />
                  Exportar Relatório
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auditoria;
