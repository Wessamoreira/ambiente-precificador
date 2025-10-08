# 🎨 Como Usar o GlassAlert Component

## 📦 Importação

```tsx
import { useGlassAlert } from '@/hooks/useGlassAlert';
```

## 🚀 Uso Básico

```tsx
export const MyPage = () => {
  const { AlertComponent, showSuccess, showError, showConfirm } = useGlassAlert();

  const handleDelete = async (id: string) => {
    showConfirm(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.',
      async () => {
        try {
          await deleteItem(id);
          showSuccess('Sucesso!', 'Item excluído com sucesso.');
        } catch (error) {
          showError('Erro', 'Não foi possível excluir o item.');
        }
      },
      'Sim, excluir',
      'Cancelar'
    );
  };

  return (
    <div>
      <button onClick={() => handleDelete('123')}>
        Excluir Item
      </button>
      
      {/* Renderizar o componente de alerta */}
      <AlertComponent />
    </div>
  );
};
```

## 🎯 Tipos de Alertas

### 1. Success (Sucesso)
```tsx
showSuccess('Operação Concluída', 'O item foi salvo com sucesso!');
```

### 2. Error (Erro)
```tsx
showError('Ops!', 'Não foi possível completar a operação.');
```

### 3. Warning (Aviso)
```tsx
showWarning('Atenção', 'Esta ação requer confirmação.');
```

### 4. Info (Informação)
```tsx
showInfo('Dica', 'Você pode usar atalhos de teclado para navegar.');
```

### 5. Confirm (Confirmação)
```tsx
showConfirm(
  'Confirmar Ação',
  'Deseja realmente continuar?',
  () => {
    // Ação ao confirmar
    console.log('Confirmado!');
  },
  'Sim, continuar', // Texto do botão confirmar
  'Cancelar'        // Texto do botão cancelar
);
```

## 💡 Exemplos Práticos

### Exemplo 1: Criar Produto
```tsx
const handleCreateProduct = async (data: ProductData) => {
  try {
    await createProduct(data);
    showSuccess(
      'Produto Criado!',
      'O produto foi adicionado ao catálogo com sucesso.'
    );
  } catch (error) {
    showError(
      'Erro ao Criar',
      'Não foi possível criar o produto. Tente novamente.'
    );
  }
};
```

### Exemplo 2: Deletar com Confirmação
```tsx
const handleDeleteProduct = (productId: string) => {
  showConfirm(
    'Excluir Produto',
    'Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.',
    async () => {
      try {
        await deleteProduct(productId);
        showSuccess('Excluído!', 'Produto removido com sucesso.');
        refreshProducts();
      } catch (error) {
        showError('Erro', 'Não foi possível excluir o produto.');
      }
    }
  );
};
```

### Exemplo 3: Validação antes de Salvar
```tsx
const handleSave = () => {
  if (!formIsValid()) {
    showWarning(
      'Dados Incompletos',
      'Por favor, preencha todos os campos obrigatórios.'
    );
    return;
  }
  
  saveData();
};
```

### Exemplo 4: Informação sobre Feature
```tsx
const showFeatureInfo = () => {
  showInfo(
    'Nova Funcionalidade',
    'Agora você pode exportar seus dados em formato Excel!'
  );
};
```

## 🎨 Personalização

### Textos dos Botões
```tsx
showConfirm(
  'Sair do Sistema',
  'Deseja realmente sair?',
  handleLogout,
  'Sim, sair',      // Custom confirm button
  'Permanecer'      // Custom cancel button
);
```

### Alert Customizado
```tsx
const { AlertComponent, showAlert } = useGlassAlert();

showAlert({
  type: 'success',
  title: 'Título Customizado',
  message: 'Mensagem customizada aqui',
  onConfirm: () => console.log('Confirmado'),
  confirmText: 'OK',
  cancelText: 'Fechar'
});
```

## ✨ Features

- 🎭 **Animações Suaves**: Entrada/saída com spring animation
- 🌈 **4 Tipos de Alertas**: Success, Error, Warning, Info
- 🎨 **Design Glassmorphism**: Efeito de vidro moderno
- 🖱️ **Fechar ao Clicar Fora**: UX melhorada
- ⌨️ **Botão X no Canto**: Alternativa para fechar
- 📱 **Totalmente Responsivo**: Funciona em mobile
- 🎯 **Confirmação de Ações**: Sistema de confirm integrado

## 🔄 Substituir window.confirm()

### Antes ❌
```tsx
const handleDelete = (id: string) => {
  if (window.confirm('Deseja excluir?')) {
    deleteItem(id);
  }
};
```

### Depois ✅
```tsx
const handleDelete = (id: string) => {
  showConfirm(
    'Confirmar Exclusão',
    'Tem certeza que deseja excluir este item?',
    () => deleteItem(id)
  );
};
```

## 🚀 Benefícios

1. **Visual Moderno**: Design consistente com o resto do app
2. **Melhor UX**: Animações e feedback visual
3. **Reutilizável**: Use em qualquer componente
4. **Type-Safe**: TypeScript completo
5. **Manutenível**: Código centralizado e fácil de manter
