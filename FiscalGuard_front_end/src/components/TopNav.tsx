import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const navigationItems = [
  { label: '📊 Estatísticas', path: '/dashboard' },
  { label: '📥 Ingestão XML', path: '/upload' },
  { label: '🧠 Auditor IA', path: '/auditoria' },
  { label: '📄 SPED & Relatórios', path: '/fechamento' },
];

export const TopNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#0B0B0F] border-b border-purple-900/20 py-4 px-6 fixed top-0 left-0 right-0 z-40 backdrop-blur-md">
      <div className="flex justify-center gap-3">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 text-sm ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-[#12121A] text-gray-300 hover:text-purple-400 hover:bg-[#1a1a24] border border-purple-900/20'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
