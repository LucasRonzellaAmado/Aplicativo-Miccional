# 🎨 Guia de Design - Diário Miccional

## Identidade Visual

Este documento descreve os padrões de design utilizados no Diário Miccional.

### Cores

#### Rosa (Primária)
- **Hex**: `#E85D75`
- **RGB**: `rgb(232, 93, 117)`
- **Uso**: Botões principais, ícones, destaques, gradientes

#### Rosa Secundária
- **Hex**: `#F4A4B4`
- **RGB**: `rgb(244, 164, 180)`
- **Uso**: Gradientes, hovers, fundos suaves

#### Rosa Clara
- **Hex**: `#FDD7E0`
- **RGB**: `rgb(253, 215, 224)`
- **Uso**: Bordas, inputs, backgrounds

#### Rosa Muito Clara
- **Hex**: `#FEE9F0`
- **RGB**: `rgb(254, 233, 240)`
- **Uso**: Backgrounds leves, cards

#### Teal (Complementar)
- **Hex**: `#167C80`
- **RGB**: `rgb(22, 124, 128)`
- **Uso**: Textos, acentos, destaques

#### Cores de Texto
- **Primário**: `#18343A` - Textos principais
- **Secundário**: `#668087` - Textos descritivos
- **Leve**: `#8FA8B0` - Placeholders, hints

#### Cores de Fundo
- **Principal**: `#FAFBFB` - Background geral
- **Light**: `#F4F8F8` - Seções alternadas
- **Card**: `#FFFFFF` - Cards, modais

### Tipografia

**Font Stack**:
```css
-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif
```

**Tamanhos**:
- `xs`: 0.875rem (14px)
- `sm`: 1rem (16px)
- `base`: 1rem (16px)
- `lg`: 1.125rem (18px)
- `xl`: 1.25rem (20px)
- `2xl`: 1.5rem (24px)
- `3xl`: 2rem (32px)

**Pesos**:
- Regular: 400
- Semibold: 600
- Bold: 700

### Espaçamento

```css
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
2xl: 3rem (48px)
```

### Sombras

```css
--shadow-sm: 0 1px 3px rgba(24, 52, 58, 0.1)
--shadow-md: 0 4px 6px rgba(24, 52, 58, 0.1)
--shadow-lg: 0 10px 15px rgba(24, 52, 58, 0.15)
```

## Componentes

### Botões

#### Botão Primário
```css
background: linear-gradient(135deg, #E85D75, #F4A4B4);
color: white;
padding: 12px 24px;
border-radius: 8px;
font-weight: 600;
```

#### Botão Secundário
```css
background: white;
color: #E85D75;
border: 2px solid #E85D75;
padding: 12px 24px;
border-radius: 8px;
font-weight: 600;
```

### Cards

```css
background: white;
border-radius: 12px;
padding: 1.5rem;
box-shadow: 0 4px 6px rgba(24, 52, 58, 0.1);
```

### Inputs

```css
border: 2px solid #FDD7E0;
border-radius: 8px;
padding: 12px;
font-family: inherit;
```

**Focus State**:
```css
border-color: #E85D75;
box-shadow: 0 0 0 3px rgba(232, 93, 117, 0.1);
```

## Padrões de Design

### Gradientes

**Rosa Principal**:
```css
background: linear-gradient(135deg, #E85D75, #F4A4B4);
```

**Rosa para Teal**:
```css
background: linear-gradient(135deg, #E85D75, #167C80);
```

### Animações

Todas as transições devem ser suaves:
```css
transition: all 0.3s ease;
```

**Respeitar preferência de redução de movimento**:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}
```

### Estados

- **Hover**: Levemente mais escuro, elevado (+2px transform)
- **Focus**: Sombra em torno, outline suave
- **Disabled**: Opacity 50%, cursor não permitido

## Acessibilidade

- Contraste mínimo WCAG AA (4.5:1 para texto)
- Ícones com `aria-label` quando necessário
- Inputs com labels associadas
- Ordem de foco lógica
- Suporte a navegação por teclado

## Responsividade

### Breakpoints

```css
Mobile: até 480px
Tablet: 481px a 768px
Desktop: 769px+
```

### Grid System

**Desktop**: 2-3 colunas
**Tablet**: 1-2 colunas
**Mobile**: 1 coluna

## Ícones

Utilizamos **Lucide React** para ícones consistentes:

```jsx
import { Droplet, Calendar, TrendingUp } from 'lucide-react'

<Droplet size={24} color="var(--primary-pink)" />
```

## Imagens e Ilustrações

### SVG Preferidos
- Escaláveis sem perda de qualidade
- Lightweight
- Fáceis de animar

### Assets
```
frontend/src/assets/
├── images/
│   ├── hero/
│   ├── health/
│   ├── hydration/
│   ├── bladder/
│   └── professional/
├── illustrations/
│   ├── dashboard.svg
│   ├── voiding.svg
│   ├── hydration.svg
│   ├── history.svg
│   └── professional.svg
└── icons/
```

## Variáveis CSS

Todas as cores e tamanhos utilizam CSS variables para fácil manutenção:

```css
:root {
  --primary-pink: #E85D75;
  --secondary-pink: #F4A4B4;
  /* ... mais variáveis */
}
```

## Exemplo de Uso

```jsx
// Componente com estilos padronizados
<div className="card">
  <button className="btn-primary">Adicionar</button>
</div>
```

```css
/* global.css */
.card {
  background: var(--bg-card);
  border-radius: 12px;
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-pink), var(--secondary-pink));
  color: white;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
}
```

---

**Última atualização**: Outubro 2024

Mantendo consistência visual em toda a aplicação! 💖
