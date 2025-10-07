# 🚀 Guia Rápido - Design Aurora

## Começando em 5 Minutos

### 1️⃣ Importação Simplificada
```tsx
import { 
  GlassCard, 
  GlassButton, 
  GlassInput,
  Modal,
  useToast 
} from '@/components/ui';
```

### 2️⃣ Card Básico com Neon
```tsx
<GlassCard 
  neonColor="violet" 
  enableNeonBorder={true}
  className="p-6"
>
  <h2 className="text-xl font-bold text-white">Meu Card Aurora</h2>
  <p className="text-gray-400">Conteúdo glassmórfico</p>
</GlassCard>
```

### 3️⃣ Formulário Completo
```tsx
function MeuForm() {
  return (
    <form className="space-y-4">
      <GlassInput
        label="Nome"
        placeholder="Digite seu nome"
        neonColor="violet"
      />
      
      <GlassSelect
        label="Categoria"
        options={[
          { value: '1', label: 'Opção 1' },
          { value: '2', label: 'Opção 2' }
        ]}
        neonColor="cyan"
      />
      
      <GlassButton variant="primary" type="submit">
        Salvar
      </GlassButton>
    </form>
  );
}
```

### 4️⃣ Toast (Notificações)
```tsx
function MinhaPage() {
  const { toast, showToast, hideToast } = useToast();

  const handleClick = () => {
    showToast('success', 'Operação realizada com sucesso!');
  };

  return (
    <>
      <GlassButton onClick={handleClick}>
        Mostrar Notificação
      </GlassButton>
      
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </>
  );
}
```

### 5️⃣ Modal
```tsx
function MinhaPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <GlassButton onClick={() => setIsOpen(true)}>
        Abrir Modal
      </GlassButton>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Meu Modal Aurora"
        size="md"
      >
        <p className="text-gray-300">Conteúdo do modal...</p>
      </Modal>
    </>
  );
}
```

---

## 🎨 Cores e Gradientes

### Texto com Gradiente Aurora
```tsx
<h1 className="bg-gradient-to-r from-aurora-violet-light via-aurora-cyan to-aurora-violet bg-clip-text text-transparent">
  Título Brilhante
</h1>
```

### Cores Disponíveis
- `aurora-violet` → #8b5cf6
- `aurora-cyan` → #06b6d4
- `aurora-rose` → #f43f5e
- `aurora-amber` → #f59e0b

### Neon Shadows
```tsx
<div className="shadow-neon-violet">Brilho Violeta</div>
<div className="shadow-neon-cyan">Brilho Ciano</div>
<div className="shadow-neon-rose">Brilho Rosa</div>
<div className="shadow-neon-amber">Brilho Âmbar</div>
```

---

## 📱 Componentes Mobile

### Swipe Card (Arrastar)
```tsx
<SwipeCard
  onSwipeLeft={() => handleDelete()}
  onSwipeRight={() => handleComplete()}
>
  <GlassCard className="p-4">
    Arraste para a esquerda ou direita
  </GlassCard>
</SwipeCard>
```

### Pull to Refresh
```tsx
<PullToRefresh onRefresh={async () => await loadData()}>
  <div>Seu conteúdo aqui</div>
</PullToRefresh>
```

### FAB (Botão Flutuante)
```tsx
import { Plus, Edit } from 'lucide-react';

<FloatingActionButton
  actions={[
    { 
      icon: <Plus className="w-5 h-5" />, 
      label: 'Adicionar', 
      onClick: () => {},
      neonColor: 'violet'
    },
    { 
      icon: <Edit className="w-5 h-5" />, 
      label: 'Editar', 
      onClick: () => {},
      neonColor: 'cyan'
    }
  ]}
/>
```

---

## 🎭 Animações

### Animações Tailwind
```tsx
// Flutuação suave
<div className="animate-float">Flutua</div>

// Pulse lento
<div className="animate-pulse-slow">Pulsa</div>

// Shimmer (brilho)
<div className="animate-shimmer">Brilha</div>

// Border flow (neon líquido)
<div className="animate-border-flow">Borda animada</div>
```

### Framer Motion Básico
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Elemento Animado
</motion.div>
```

---

## 🔧 Variantes de Componentes

### GlassButton Variantes
```tsx
<GlassButton variant="primary">Primário</GlassButton>
<GlassButton variant="secondary">Secundário</GlassButton>
<GlassButton variant="success">Sucesso</GlassButton>
<GlassButton variant="danger">Perigo</GlassButton>
<GlassButton variant="ghost">Fantasma</GlassButton>
```

### Tamanhos
```tsx
<GlassButton size="sm">Pequeno</GlassButton>
<GlassButton size="md">Médio</GlassButton>
<GlassButton size="lg">Grande</GlassButton>
```

### Cores Neon
```tsx
<GlassCard neonColor="violet">Violeta</GlassCard>
<GlassCard neonColor="cyan">Ciano</GlassCard>
<GlassCard neonColor="rose">Rosa</GlassCard>
<GlassCard neonColor="amber">Âmbar</GlassCard>
```

---

## 💡 Dicas Rápidas

### ✅ Faça
- Use `enableNeonBorder={true}` em cards importantes
- Combine cores neon com gradientes
- Mobile-first sempre (sm, md, lg)
- Use `space-y-4` ou `gap-4` para espaçamento

### ❌ Evite
- Muitos neons na mesma tela (poluição visual)
- Animações em elementos grandes (performance)
- backdrop-blur em listas longas (mobile)

---

## 🎯 Exemplos Práticos

### Card de Dashboard
```tsx
<GlassCard 
  neonColor="violet" 
  enableNeonBorder={true}
  className="p-6 bg-gradient-to-br from-aurora-violet/20 to-transparent"
>
  <div className="flex items-center gap-4">
    <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xl">
      <DollarSign className="w-6 h-6 text-aurora-violet" />
    </div>
    <div>
      <p className="text-sm text-gray-400 uppercase">Faturamento</p>
      <h3 className="text-3xl font-bold text-white">R$ 12.500</h3>
    </div>
  </div>
</GlassCard>
```

### Formulário de Login
```tsx
<GlassCard className="p-8" enableNeonBorder neonColor="violet">
  <h1 className="text-4xl font-bold bg-gradient-to-r from-aurora-violet-light to-aurora-cyan bg-clip-text text-transparent mb-6">
    Login
  </h1>
  
  <form className="space-y-4">
    <GlassInput
      label="Email"
      icon={<Mail className="w-5 h-5" />}
      neonColor="violet"
      type="email"
    />
    
    <GlassInput
      label="Senha"
      icon={<Lock className="w-5 h-5" />}
      neonColor="cyan"
      type="password"
    />
    
    <GlassButton variant="primary" size="lg" className="w-full">
      Entrar
    </GlassButton>
  </form>
</GlassCard>
```

### Lista com Swipe
```tsx
{items.map(item => (
  <SwipeCard
    key={item.id}
    onSwipeLeft={() => deleteItem(item.id)}
    onSwipeRight={() => completeItem(item.id)}
  >
    <GlassCard className="p-4">
      <h3 className="text-white font-semibold">{item.name}</h3>
      <p className="text-gray-400 text-sm">{item.description}</p>
    </GlassCard>
  </SwipeCard>
))}
```

---

## 📚 Recursos

- **Documentação Completa**: [DESIGN-AURORA-UPGRADE.md](./DESIGN-AURORA-UPGRADE.md)
- **Ícones**: [Lucide React](https://lucide.dev)
- **Animações**: [Framer Motion](https://www.framer.com/motion/)
- **Tailwind**: [Configuração customizada](./precificapro-frontend/tailwind.config.js)

---

## 🎨 Paleta Rápida

### Backgrounds
```css
bg-aurora-night-deep     /* Fundo escuro profundo */
bg-white/5               /* Glass sutil */
bg-white/10              /* Glass médio */
bg-aurora-violet/20      /* Overlay violeta */
```

### Text
```css
text-white               /* Texto principal */
text-gray-300            /* Texto secundário */
text-gray-400            /* Texto terciário */
text-aurora-violet       /* Destaque violeta */
text-aurora-cyan         /* Destaque ciano */
```

### Border
```css
border-white/10          /* Borda sutil */
border-white/20          /* Borda média */
border-aurora-violet/50  /* Borda violeta */
```

---

**Aurora Edition · v1.0.0**

Desenvolvido com 💜 seguindo os princípios Lovable AI
