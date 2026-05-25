import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Company {
  id: number;
  name: string;
  cnpj: string;
}

interface GlobalContextType {
  selectedCompanyId: number;
  setSelectedCompanyId: (id: number) => void;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  companies: Company[];
  setCompanies: (companies: Company[]) => void;
  userProfile: {
    name: string;
    role: string;
    initials: string;
  };
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(5);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [companies, setCompanies] = useState<Company[]>([
    { id: 1, name: 'DEVS OUTSOURCING LTDA', cnpj: '12.345.678/0001-90' },
    { id: 2, name: 'ACME S/A', cnpj: '98.765.432/0001-10' },
  ]);

  const userProfile = {
    name: 'James Radcliffe',
    role: 'Admin',
    initials: 'JR',
  };

  const value: GlobalContextType = {
    selectedCompanyId,
    setSelectedCompanyId,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    companies,
    setCompanies,
    userProfile,
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobalContext deve ser usado dentro de GlobalProvider');
  }
  return context;
};
