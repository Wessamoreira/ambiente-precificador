import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calculator, ShoppingCart, History, Package, Users, DollarSign, Tag, Folder, Warehouse, Sparkles, TrendingUp, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const menuItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, neonColor: 'violet' as const },
    { to: '/sales/ranking', label: 'Ranking Produtos', icon: Trophy, neonColor: 'amber' as const },
    { to: '/customers/analytics', label: 'Análise Clientes', icon: TrendingUp, neonColor: 'amber' as const },
    { to: '/simulations', label: 'Simulação', icon: Calculator, neonColor: 'cyan' as const },
    { to: '/sales/record', label: 'Nova Venda', icon: ShoppingCart, neonColor: 'cyan' as const },
    { to: '/sales/history', label: 'Histórico', icon: History, neonColor: 'rose' as const },
  ];

  const managementItems = [
    { to: '/products', label: 'Produtos', icon: Package, neonColor: 'violet' as const },
    { to: '/categories', label: 'Categorias', icon: Folder, neonColor: 'violet' as const },
    { to: '/inventory', label: 'Estoque', icon: Warehouse, neonColor: 'cyan' as const },
    { to: '/customers', label: 'Clientes', icon: Users, neonColor: 'cyan' as const },
    { to: '/cost-items', label: 'Custos', icon: DollarSign, neonColor: 'amber' as const },
    { to: '/pricing-profiles', label: 'Preços', icon: Tag, neonColor: 'rose' as const },
  ];

  const neonClasses = {
    violet: 'shadow-neon-violet border-aurora-violet/50',
    cyan: 'shadow-neon-cyan border-aurora-cyan/50',
    amber: 'shadow-neon-amber border-aurora-amber/50',
    rose: 'shadow-neon-rose border-aurora-rose/50',
  };

  return (
    <>
      {/* Overlay Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose} 
            className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[60] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full w-72 backdrop-blur-3xl bg-white/5 border-r border-white/10 z-[70] md:relative overflow-y-auto transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Brilho Aurora lateral */}
        <div className="absolute inset-0 bg-gradient-to-b from-aurora-violet/10 via-aurora-cyan/5 to-aurora-rose/10 pointer-events-none" />
        
        {/* Logo */}
        <div className="relative p-6 border-b border-white/10">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-center tracking-wider bg-gradient-to-r from-aurora-violet-light via-aurora-cyan to-aurora-violet bg-clip-text text-transparent flex items-center justify-center gap-2"
          >
            <Sparkles className="w-6 h-6 text-aurora-violet animate-pulse" />
            PrecificaPro
          </motion.h1>
        </div>
        
        <nav className="relative mt-6 px-4 pb-24 flex flex-col gap-3">
          {/* Menu Principal */}
          {menuItems.map(({ to, label, icon: Icon, neonColor }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
            >
              {({ isActive }) => (
                <div className={
                  isActive 
                    ? `relative flex items-center gap-4 py-3.5 px-4 rounded-2xl text-base font-medium transition-all duration-300 group bg-white/10 ${neonClasses[neonColor]} text-white scale-105`
                    : 'relative flex items-center gap-4 py-3.5 px-4 rounded-2xl text-base font-medium transition-all duration-300 group text-gray-300 hover:bg-white/10 hover:text-white hover:scale-105'
                }>
                  <div className={isActive ? 'p-2 rounded-xl bg-white/20 transition-all' : 'p-2 rounded-xl bg-white/5 group-hover:bg-white/10 transition-all'}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-semibold">{label}</span>
                  
                  {/* Shimmer effect no hover */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer bg-[length:200%_100%]" />
                  </div>
                </div>
              )}
            </NavLink>
          ))}

          {/* Divider com título */}
          <div className="relative my-6">
            <div className="flex items-center gap-3 px-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <span className="text-xs text-aurora-cyan font-bold uppercase tracking-widest">Gestão</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>
          </div>
          
          {/* Menu Gerenciamento */}
          {managementItems.map(({ to, label, icon: Icon, neonColor }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
            >
              {({ isActive }) => (
                <div className={
                  isActive 
                    ? `relative flex items-center gap-4 py-3.5 px-4 rounded-2xl text-base font-medium transition-all duration-300 group bg-white/10 ${neonClasses[neonColor]} text-white scale-105`
                    : 'relative flex items-center gap-4 py-3.5 px-4 rounded-2xl text-base font-medium transition-all duration-300 group text-gray-300 hover:bg-white/10 hover:text-white hover:scale-105'
                }>
                  <div className={isActive ? 'p-2 rounded-xl bg-white/20 transition-all' : 'p-2 rounded-xl bg-white/5 group-hover:bg-white/10 transition-all'}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-semibold">{label}</span>
                  
                  <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer bg-[length:200%_100%]" />
                  </div>
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};