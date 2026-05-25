import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNav } from '../components/TopNav';
import { RightPanel } from '../components/RightPanel';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#0B0B0F]">
      {/* TOP NAVIGATION - FIXED */}
      <TopNav />

      {/* MAIN CONTENT WITH RIGHT SIDEBAR */}
      <div className="flex flex-1 overflow-hidden pt-20">
        {/* CONTENT AREA */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>

        {/* RIGHT SIDEBAR - CONTEXT PANEL */}
        <RightPanel />
      </div>
    </div>
  );
};

export default Layout;
