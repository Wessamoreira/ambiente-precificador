import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Chatbot } from '../Chatbot';
import { motion } from 'framer-motion';

export const MainLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar com animação suave */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header onMenuButtonClick={() => setSidebarOpen(true)} />
        
        {/* Main Content com scroll suave */}
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-x-hidden overflow-y-auto"
        >
          {/* Container responsivo mobile-first */}
          <div className="min-h-full p-4 sm:p-6 md:p-8 lg:p-10">
            <div className="w-full max-w-[1600px] mx-auto">
              <Outlet />
            </div>
          </div>
        </motion.main>

        {/* Indicador de scroll para mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-aurora-violet via-aurora-cyan to-aurora-rose opacity-20 pointer-events-none z-[60]" />
      </div>
      
      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};