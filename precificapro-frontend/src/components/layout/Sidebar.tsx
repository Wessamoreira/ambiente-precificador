import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calculator, ShoppingCart, History, Package, Users, DollarSign, Tag, Folder, Warehouse } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const activeLinkStyle = {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    borderColor: 'rgba(139, 92, 246, 0.8)',
    color: 'white',
    borderLeftWidth: '4px'
  };

  const menuItems = [
    { to: '/dashboard', label: 'Painel', icon: LayoutDashboard, color: 'text-gray-200' },
    { to: '/simulations', label: 'Simulação', icon: Calculator, color: 'text-yellow-300' },
    { to: '/sales/record', label: 'Registrar Venda', icon: ShoppingCart, color: 'text-green-300' },
  ];

  const managementItems = [
    { to: '/sales/history', label: 'Histórico de Vendas', icon: History, color: 'text-gray-200' },
    { to: '/categories', label: 'Categorias', icon: Folder, color: 'text-purple-300' },
    { to: '/inventory', label: 'Estoque', icon: Warehouse, color: 'text-blue-300' },
    { to: '/products', label: 'Produtos', icon: Package, color: 'text-gray-200' },
    { to: '/customers', label: 'Clientes', icon: Users, color: 'text-gray-200' },
    { to: '/cost-items', label: 'Custos Fixos', icon: DollarSign, color: 'text-gray-200' },
    { to: '/pricing-profiles', label: 'Perfis de Preço', icon: Tag, color: 'text-gray-200' },
  ];

  return (
    <>
      <div onClick={onClose} className={`fixed inset-0 bg-black/50 z-30 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />
      <aside className={`fixed top-0 left-0 h-full w-64 backdrop-blur-2xl bg-gradient-to-b from-black/30 to-black/10 border-r border-white/10 z-40 transition-transform transform md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto`}>
        <div className="p-6 border-b border-white/10">
          <h1 className="text-3xl font-bold text-center tracking-wider bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">PrecificaPro</h1>
        </div>
        
        <nav className="mt-6 px-3 flex flex-col gap-1">
          {menuItems.map(({ to, label, icon: Icon, color }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => isActive ? activeLinkStyle : {}}
              className={`flex items-center gap-3 py-3 px-4 rounded-lg ${color} border border-transparent hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-200 font-semibold group`}
              onClick={onClose}
            >
              <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>{label}</span>
            </NavLink>
          ))}

          <hr className="border-white/10 my-4" />
          
          <h3 className="px-4 text-xs text-gray-400 uppercase font-semibold mb-2 tracking-wider">Gerenciamento</h3>
          
          {managementItems.map(({ to, label, icon: Icon, color }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => isActive ? activeLinkStyle : {}}
              className={`flex items-center gap-3 py-3 px-4 rounded-lg ${color} border border-transparent hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-200 group`}
              onClick={onClose}
            >
              <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-gradient-to-t from-black/40 to-transparent">
          <p className="text-xs text-center text-gray-400">v1.0.0</p>
        </div>
      </aside>
    </>
  );
};