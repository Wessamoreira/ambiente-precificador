import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { StockNotifications } from '../StockNotifications';
import { Menu, Sun, Moon, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  onMenuButtonClick: () => void;
}

export const Header = ({ onMenuButtonClick }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex justify-between items-center px-4 md:px-6 h-16 md:h-20 backdrop-blur-2xl bg-white/10 border-b border-white/20 fixed top-0 left-0 right-0 z-50 shadow-xl"
    >
      {/* Brilho Aurora no topo */}
      <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-r from-aurora-violet/10 via-aurora-cyan/10 to-aurora-rose/10 pointer-events-none opacity-50" />
      
      {/* Botão Hamburger - Mobile */}
      <motion.button 
        onClick={onMenuButtonClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative z-10 md:hidden p-2.5 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 hover:shadow-neon-violet"
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </motion.button>

      {/* Espaçador */}
      <div className="flex-1"></div>

      <div className="relative z-10 flex items-center gap-3">
        {/* Notificações de Estoque */}
        <StockNotifications />
        
        {/* Botão de Tema */}
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.05, rotate: 15 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="p-2.5 rounded-xl text-gray-300 hover:bg-aurora-cyan/20 hover:text-aurora-cyan border border-transparent hover:border-aurora-cyan/30 transition-all duration-300 hover:shadow-neon-cyan group"
          aria-label="Alternar tema"
        >
          <motion.div
            animate={{ rotate: theme === 'light' ? 0 : 180 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </motion.div>
        </motion.button>
        
        {/* Botão de Sair */}
        <motion.button
          onClick={logout}
          whileHover={{ scale: 1.05, x: 3 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-aurora-rose/20 hover:text-aurora-rose rounded-xl transition-all duration-300 group border border-transparent hover:border-aurora-rose/30 hover:shadow-neon-rose"
        >
          <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          <span className="hidden sm:inline font-semibold">Sair</span>
        </motion.button>
      </div>
    </motion.header>
  );
};