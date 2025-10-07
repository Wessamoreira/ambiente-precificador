import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Menu, Sun, Moon, LogOut } from 'lucide-react';

// O Header agora recebe uma função para ser chamada quando o botão de menu for clicado
interface HeaderProps {
  onMenuButtonClick: () => void;
}

export const Header = ({ onMenuButtonClick }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  return (
    <header className="flex justify-between items-center px-4 md:px-6 h-16 md:h-20 backdrop-blur-2xl bg-gradient-to-r from-black/20 via-black/10 to-black/20 border-b border-white/10 sticky top-0 z-20">
      {/* Botão Hamburger - Visível apenas em telas pequenas */}
      <button 
        onClick={onMenuButtonClick}
        className="md:hidden p-2 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200 active:scale-95"
        aria-label="Abrir menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Espaçador para empurrar os próximos itens para a direita */}
      <div className="flex-1"></div>

      <div className="flex items-center gap-2">
        {/* Botão de Tema */}
        <button
          onClick={toggleTheme}
          className="p-2 md:p-2.5 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200 active:scale-95 group"
          aria-label="Alternar tema"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          ) : (
            <Sun className="w-5 h-5 group-hover:rotate-45 transition-transform" />
          )}
        </button>
        
        {/* Botão de Sair */}
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 md:px-4 py-2 text-gray-300 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-all duration-200 active:scale-95 group border border-transparent hover:border-red-500/30"
        >
          <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          <span className="hidden sm:inline font-medium">Sair</span>
        </button>
      </div>
    </header>
  );
};