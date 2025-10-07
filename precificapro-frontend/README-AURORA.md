# 🌌 PrecificaPro - Aurora Edition

Uma experiência visual surreal e imponente, construída com **Glassmorfismo** e **Efeito Aurora**.

---

## ✨ Características Principais

### 🎨 Design System Aurora
- **Glassmorfismo Avançado**: Blur 3D com 40-60px de profundidade
- **Neon Líquido**: Bordas animadas com fluxo de cores
- **Aurora Background**: Fundo vivo e respiratório com gradientes animados
- **Micro-interações**: Física realista com Framer Motion
- **Mobile-First**: Responsividade extrema com thumb zone otimizada

### 🧩 Componentes UI
- ✅ GlassCard com efeito 3D
- ✅ GlassButton com 5 variantes
- ✅ GlassInput/Select/Textarea
- ✅ Modal glassmórfico responsivo
- ✅ Toast system com animações
- ✅ SwipeCard para gestos mobile
- ✅ PullToRefresh personalizado
- ✅ FloatingActionButton (FAB)

### 📱 Mobile-First
- Gestos nativos (swipe, pull-to-refresh)
- Thumb zone otimizada
- Performance otimizada para GPU mobile
- Touch feedback instantâneo (<16ms)

---

## 🚀 Instalação

### Dependências Já Instaladas
```json
{
  "framer-motion": "^12.23.22",
  "lucide-react": "^0.544.0",
  "tailwindcss": "^3.4.18"
}
```

---

## 🎨 Estrutura de Componentes

```
src/
├── components/
│   ├── ui/
│   │   ├── GlassCard.tsx          # Card glassmórfico com 3D
│   │   ├── GlassButton.tsx        # Botão com variantes
│   │   ├── GlassInput.tsx         # Input com validação
│   │   ├── GlassSelect.tsx        # Select customizado
│   │   ├── GlassTextarea.tsx      # Textarea glassmórfico
│   │   ├── Modal.tsx              # Modal responsivo
│   │   ├── Toast.tsx              # Sistema de notificações
│   │   ├── SwipeCard.tsx          # Card com gestos
│   │   ├── PullToRefresh.tsx      # Pull to refresh
│   │   ├── FloatingActionButton.tsx # FAB
│   │   └── index.ts               # Exports centralizados
│   │
│   └── layout/
│       ├── Header.tsx             # Header Aurora
│       ├── Sidebar.tsx            # Sidebar animada
│       └── MainLayout.tsx         # Layout principal
│
├── pages/
│   ├── DashboardPage.tsx          # Dashboard com cards neon
│   ├── LoginPage.tsx              # Login Aurora
│   └── ...
│
└── index.css                      # Estilos globais Aurora
```

---

## 🎯 Uso Básico

### Importação
```tsx
import { 
  GlassCard, 
  GlassButton, 
  GlassInput,
  Modal,
  useToast 
} from '@/components/ui';
```

### Card com Neon Líquido
```tsx
<GlassCard 
  neonColor="violet" 
  enableNeonBorder={true}
  enable3D={true}
  className="p-6"
>
  <h2 className="text-2xl font-bold text-white">Título</h2>
</GlassCard>
```

### Formulário
```tsx
<form className="space-y-4">
  <GlassInput
    label="Email"
    icon={<Mail />}
    neonColor="violet"
  />
  
  <GlassButton variant="primary" size="lg">
    Enviar
  </GlassButton>
</form>
```

### Toast (Notificações)
```tsx
const { toast, showToast, hideToast } = useToast();

showToast('success', 'Operação realizada!');

<Toast
  type={toast.type}
  message={toast.message}
  isVisible={toast.isVisible}
  onClose={hideToast}
/>
```

---

## 🎨 Paleta de Cores

```javascript
// Aurora Night (Fundos)
aurora-night-deep: '#0a0e27'
aurora-night-dark: '#141b3b'
aurora-night-mid: '#1e2a4a'

// Aurora Colors (Neon)
aurora-violet: '#8b5cf6'
aurora-cyan: '#06b6d4'
aurora-rose: '#f43f5e'
aurora-amber: '#f59e0b'
```

### Gradientes
```tsx
// Texto Aurora
<h1 className="bg-gradient-to-r from-aurora-violet-light via-aurora-cyan to-aurora-violet bg-clip-text text-transparent">
  Texto Brilhante
</h1>

// Card com gradiente
<GlassCard className="bg-gradient-to-br from-aurora-violet/20 to-transparent">
  Conteúdo
</GlassCard>
```

---

## 🎭 Animações

### Tailwind Animations
```tsx
animate-aurora      // Fundo Aurora animado
animate-float       // Flutuação suave
animate-shimmer     // Brilho deslizante
animate-border-flow // Neon líquido
```

### Framer Motion
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

## 📱 Componentes Mobile

### Swipe Card
```tsx
<SwipeCard
  onSwipeLeft={handleDelete}
  onSwipeRight={handleComplete}
>
  <GlassCard>Conteúdo</GlassCard>
</SwipeCard>
```

### Pull to Refresh
```tsx
<PullToRefresh onRefresh={loadData}>
  <YourContent />
</PullToRefresh>
```

### FAB (Floating Action Button)
```tsx
<FloatingActionButton
  position="bottom-right"
  actions={[
    { icon: <Plus />, label: 'Adicionar', onClick: () => {} }
  ]}
/>
```

---

## 🔧 Configuração Tailwind

### tailwind.config.js
```javascript
export default {
  theme: {
    extend: {
      colors: {
        aurora: { /* cores customizadas */ }
      },
      animation: {
        aurora: 'aurora 20s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        // ...
      }
    }
  }
}
```

### index.css
```css
/* Fundo Aurora animado */
body::before {
  background: linear-gradient(135deg, #0a0e27 0%, #1e2a4a 50%, #0a0e27 100%);
  animation: aurora 20s ease-in-out infinite;
}

/* Scrollbar personalizado */
::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #8b5cf6 0%, #06b6d4 100%);
}
```

---

## 🎯 Variantes de Componentes

### GlassButton
- `variant`: primary | secondary | success | danger | ghost
- `size`: sm | md | lg
- `neonGlow`: true | false

### GlassCard
- `neonColor`: violet | cyan | rose | amber
- `enableNeonBorder`: true | false
- `enable3D`: true | false

### Modal
- `size`: sm | md | lg | xl

---

## 📊 Performance

### Otimizações Aplicadas
- ✅ `will-change` em animações críticas
- ✅ Apenas `transform` e `opacity` em animações
- ✅ Lazy loading de componentes
- ✅ Backdrop-filter condicional para mobile
- ✅ Debounce em eventos de scroll

### Métricas Esperadas
- FCP: < 1.5s
- LCP: < 2.5s
- CLS: < 0.1
- Touch Response: < 16ms

---

## 📚 Documentação Completa

- **[DESIGN-AURORA-UPGRADE.md](../DESIGN-AURORA-UPGRADE.md)**: Documentação técnica completa
- **[GUIA-RAPIDO-AURORA.md](../GUIA-RAPIDO-AURORA.md)**: Guia rápido de uso

---

## 🎨 Exemplos

### Dashboard Card
```tsx
<GlassCard 
  neonColor="cyan" 
  enableNeonBorder={true}
  className="p-6 bg-gradient-to-br from-aurora-cyan/20 to-transparent"
>
  <div className="flex items-center gap-4">
    <DollarSign className="w-8 h-8 text-aurora-cyan" />
    <div>
      <p className="text-sm text-gray-400">Faturamento</p>
      <h3 className="text-3xl font-bold text-white">R$ 12.500</h3>
    </div>
  </div>
</GlassCard>
```

### Login Form
```tsx
<GlassCard className="p-8" enableNeonBorder neonColor="violet">
  <h1 className="text-4xl font-bold bg-gradient-to-r from-aurora-violet-light to-aurora-cyan bg-clip-text text-transparent mb-6">
    Login Aurora
  </h1>
  
  <GlassInput
    label="Email"
    icon={<Mail />}
    neonColor="violet"
  />
  
  <GlassInput
    label="Senha"
    icon={<Lock />}
    neonColor="cyan"
    type="password"
  />
  
  <GlassButton variant="primary" className="w-full">
    Entrar
  </GlassButton>
</GlassCard>
```

---

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Preview
npm run preview

# Lint
npm run lint
```

---

## 🤝 Contribuindo

Ao adicionar novos componentes:
1. Siga o padrão mobile-first
2. Use a paleta Aurora
3. Implemente animações suaves (spring physics)
4. Garanta acessibilidade (ARIA, keyboard)
5. Otimize performance

---

## 📝 Changelog

### v1.0.0 - Aurora Edition
- ✨ Design System Aurora completo
- 🎨 Glassmorfismo com Neon Líquido
- 📱 Componentes mobile-first
- 🎭 Sistema de animações avançado
- ⚡ Performance otimizada

---

## 📄 Licença

Este projeto faz parte do PrecificaPro.

---

**Aurora Edition · v1.0.0**

Desenvolvido com 💜 seguindo os princípios **Lovable AI**
