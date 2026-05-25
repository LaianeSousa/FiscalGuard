import React from 'react'
import { Calendar, ChevronDown } from 'lucide-react'

const companies = [
  { id: '1', name: 'ACME S/A' },
  { id: '2', name: 'Global Tech' }
]

interface Props {
  empresaId: string
  onChangeEmpresa: (id: string) => void
  mes: number
  ano: number
  setMes: (m: number) => void
  setAno: (a: number) => void
}

const Sidebar: React.FC<Props> = ({ empresaId, onChangeEmpresa, mes, ano, setMes, setAno }) => {
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const years = [2025, 2026, 2027]

  return (
    <aside className="w-80 bg-slate-800 p-6 border-r border-slate-700 min-h-screen">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-500 rounded flex items-center justify-center font-bold">FG</div>
        <div>
          <div className="text-lg font-semibold">FiscalGuard</div>
          <div className="text-sm text-slate-400">Auditoria Preditiva • Compliance</div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm text-slate-300 mb-2">Empresa</label>
        <select
          value={empresaId}
          onChange={(e) => onChangeEmpresa(e.target.value)}
          className="w-full bg-slate-700 text-slate-100 p-2 rounded"
        >
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-slate-300 mb-2">Período</label>
        <div className="flex gap-2">
          <select value={mes} onChange={(e) => setMes(Number(e.target.value))} className="bg-slate-700 p-2 rounded">
            {months.map((m) => (
              <option key={m} value={m}>
                {m.toString().padStart(2, '0')}
              </option>
            ))}
          </select>
          <select value={ano} onChange={(e) => setAno(Number(e.target.value))} className="bg-slate-700 p-2 rounded">
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 text-slate-400 text-sm flex items-center gap-2">
        <Calendar size={16} />
        Seletor de Período dinâmico
      </div>

    </aside>
  )
}

export default Sidebar
