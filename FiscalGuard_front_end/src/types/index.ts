// ============================================================================
// TIPOS GLOBAIS - CONTEXT, API & COMPONENTES
// ============================================================================

export interface Empresa {
  id: number;
  cnpj: string;
  razao_social: string;
  regime_tributario: string;
}

export interface NfeFiscal {
  chave_acesso: string;
  numero_nota: number;
  empresa_emitente: string;
  valor_total: number;
  data_emissao: string;
  status: string;
  total_itens_processados: number;
}

export interface KPIData {
  faturamento_bruto: number;
  pis_a_pagar: number;
  cofins_a_pagar: number;
  score_conformidade: number;
}

export interface ItemAuditoria {
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

export interface RelatorioAuditoria {
  sucesso: boolean;
  total_analisado: number;
  total_anomalias: number;
  itens: ItemAuditoria[];
}

export interface UploadResponse {
  sucesso: boolean;
  mensagem: string;
  dados: {
    chave_acesso: string;
    numero_nota: number;
    empresa_emitente: string;
    valor_total: number;
    total_itens_processados: number;
  };
}

export interface ApuracaoResponse {
  sucesso: boolean;
  periodo: string;
  dados_apurados: {
    faturamento_declarado: number;
    valor_pis: number;
    valor_cofins: number;
    tipo_arquivo: string;
  };
}

export interface IngestaoRecord {
  id: string;
  nome_arquivo: string;
  data_hora: string;
  status: 'sucesso' | 'erro';
  empresa?: string;
  nfe_numero?: number;
}

export interface GraficoDataPoint {
  mes: string;
  faturamento: number;
  pis: number;
  cofins: number;
}
