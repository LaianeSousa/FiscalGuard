import React, { useMemo, useState } from 'react'
import type { AuditoriaItem } from '../api/types'
import { currency } from '../utils/format'

interface Props {
  data: AuditoriaItem[]
  loading?: boolean
}

const AuditTable: React.FC<Props> = ({ data, loading }) => {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return data
    return data.filter((d) => d.produto.toLowerCase().includes(q) || d.codigo.toLowerCase().includes(q))
  }, [data, query])

  return (
    <div className="p-4 bg-slate-800 rounded border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-semibold">Feed de Auditoria</div>
        <input
          placeholder="Buscar produto ou código"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-slate-700 p-2 rounded text-sm"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm">
          <thead>
            <tr className="text-slate-400 text-left">
              <th className="px-2 py-2">Status</th>
              <th className="px-2 py-2">Produto</th>
              <th className="px-2 py-2">Código</th>
              <th className="px-2 py-2">NCM</th>
              <th className="px-2 py-2">CST</th>
              <th className="px-2 py-2">Valor Unit.</th>
              <th className="px-2 py-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-6 text-center text-slate-400">Carregando...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-6 text-center text-slate-400">Nenhum item encontrado</td>
              </tr>
            ) : (
              filtered.map((row, idx) => (
                <tr key={idx} className="border-t border-slate-700">
                  <td className="px-2 py-3">
                    {row.is_anomalia ? (
                      <span className="px-2 py-1 bg-red-600 text-white rounded">ANOMALIA</span>
                    ) : (
                      <span className="px-2 py-1 bg-green-600 text-white rounded">NORMAL</span>
                    )}
                  </td>
                  <td className="px-2 py-3">{row.produto}</td>
                  <td className="px-2 py-3">{row.codigo}</td>
                  <td className="px-2 py-3">{row.ncm}</td>
                  <td className="px-2 py-3">{row.cst_pis}</td>
                  <td className="px-2 py-3">{currency(row.valor_unitario)}</td>
                  <td className="px-2 py-3">{row.score_bizarrice.toFixed(4)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AuditTable
