import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import type { ApuracaoResponse, AuditoriaResponse } from '../api/types'
import { currency } from '../utils/format'

interface Props {
  apuracao: ApuracaoResponse | null
  auditoria: AuditoriaResponse | null
}

const COLORS = ['#10B981', '#EF4444']

const ChartsPanel: React.FC<Props> = ({ apuracao, auditoria }) => {
  const normal = (auditoria?.total_analisado ?? 0) - (auditoria?.total_anomalias ?? 0)
  const anomalies = auditoria?.total_anomalias ?? 0

  const pieData = [
    { name: 'Normal', value: Math.max(0, normal) },
    { name: 'Anomalias', value: Math.max(0, anomalies) }
  ]

  const barData = [
    { name: apuracao?.periodo ?? '—', PIS: apuracao?.dados_apurados.valor_pis ?? 0, COFINS: apuracao?.dados_apurados.valor_cofins ?? 0 }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="p-4 bg-slate-800 rounded border border-slate-700 h-64">
        <div className="text-sm text-slate-300 mb-2">Itens: Normais vs Anomalias</div>
        <ResponsiveContainer width="100%" height="80%">
          <PieChart>
            <Pie data={pieData} innerRadius={50} outerRadius={80} dataKey="value">
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="p-4 bg-slate-800 rounded border border-slate-700 h-64">
        <div className="text-sm text-slate-300 mb-2">Impostos ({apuracao?.periodo ?? '—'})</div>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={barData}>
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip formatter={(value: any) => currency(Number(value))} />
            <Legend />
            <Bar dataKey="PIS" fill="#F59E0B" />
            <Bar dataKey="COFINS" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ChartsPanel
