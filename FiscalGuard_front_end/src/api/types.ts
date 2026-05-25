export interface UploadResponse {
  sucesso: true
  mensagem: string
  dados: {
    chave_acesso: string
    numero_nota: number
    empresa_emitente: string
    valor_total: number
    total_itens_processados: number
  }
}

export interface ApuracaoResponse {
  sucesso: true
  periodo: string
  dados_apurados: {
    faturamento_declarado: number
    valor_pis: number
    valor_cofins: number
    tipo_arquivo: string
  }
}

export interface AuditoriaItem {
  produto: string
  codigo: string
  ncm: string
  cst_pis: string
  valor_unitario: number
  is_anomalia: boolean
  score_bizarrice: number
}

export interface AuditoriaResponse {
  sucesso: true
  total_analisado: number
  total_anomalias: number
  itens: AuditoriaItem[]
}
