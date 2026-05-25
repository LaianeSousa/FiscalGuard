import React from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { ChevronDown } from 'lucide-react';

export const RightPanel: React.FC = () => {
  const {
    selectedCompanyId,
    setSelectedCompanyId,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    companies,
    userProfile,
  } = useGlobalContext();

  const months = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' },
  ];

  const years = Array.from({ length: 5 }, (_, i) => 2024 + i);

  return (
    <div className="w-80 bg-[#12121A] border-l border-[#1E1E2E] flex flex-col h-full">
      {/* User Profile Section */}
      <div className="p-6 border-b border-[#1E1E2E]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] rounded-full flex items-center justify-center text-white font-bold">
            {userProfile.initials}
          </div>
          <div>
            <div className="text-white font-semibold text-sm">{userProfile.name}</div>
            <div className="text-gray-500 text-xs">{userProfile.role}</div>
          </div>
        </div>
      </div>

      {/* Companies Section */}
      <div className="p-6 border-b border-[#1E1E2E] flex-1 overflow-y-auto">
        <h3 className="text-white font-semibold text-sm mb-4">Empresas Cadastradas</h3>
        <div className="space-y-3">
          {companies.map((company) => (
            <button
              key={company.id}
              onClick={() => setSelectedCompanyId(company.id)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                selectedCompanyId === company.id
                  ? 'bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/20'
                  : 'bg-[#0B0B0F] text-gray-400 hover:text-white hover:bg-[#1E1E2E]'
              }`}
            >
              <div className="font-medium text-sm truncate">{company.name}</div>
              <div className="text-xs opacity-70 truncate">{company.cnpj}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Period Selector Section */}
      <div className="p-6 border-t border-[#1E1E2E]">
        <h3 className="text-white font-semibold text-sm mb-4">Período Fiscal</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 block mb-2">Mês</label>
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full bg-[#0B0B0F] text-white text-sm px-3 py-2 rounded-lg border border-[#1E1E2E] focus:border-[#8B5CF6] focus:outline-none appearance-none cursor-pointer"
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value} className="bg-[#12121A]">
                    {month.value.toString().padStart(2, '0')} - {month.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-2">Ano</label>
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full bg-[#0B0B0F] text-white text-sm px-3 py-2 rounded-lg border border-[#1E1E2E] focus:border-[#8B5CF6] focus:outline-none appearance-none cursor-pointer"
              >
                {years.map((year) => (
                  <option key={year} value={year} className="bg-[#12121A]">
                    {year}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
