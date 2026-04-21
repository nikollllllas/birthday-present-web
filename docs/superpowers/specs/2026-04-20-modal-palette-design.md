# Modal Palette Refactor — Design Spec

**Goal:** Substituir os tokens zinc/dark-mode dos modais admin pela paleta burgundy/cream/blush do site, tornando-os visualmente consistentes com o restante da aplicação.

**Scope:** `src/routes/-components/present-modal.tsx` e `src/routes/-components/category-modal.tsx`. Nenhuma lógica, prop ou handler é alterado — apenas classes Tailwind.

---

## Contexto

Os modais atualmente usam classes `zinc-*` com variantes `dark:` que não existem no tema do site. A paleta do site é definida em `src/styles.css` via variáveis CSS em `:root` e usada em todo o restante da aplicação.

---

## Token Map

| Elemento | Antes | Depois |
|---|---|---|
| Overlay | `bg-black/50` | `bg-[var(--burgundy-glow)] backdrop-blur-sm` |
| Container fundo | `bg-white dark:bg-zinc-900` | `bg-[var(--surface)]` |
| Container borda | *(ausente)* | `border border-[rgba(128,0,32,0.2)]` |
| Container sombra | `shadow-xl` | `shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_28px_56px_rgba(128,0,32,0.07),0_8px_22px_rgba(0,0,0,0.05)]` |
| Título | `text-lg font-semibold` | `font-display italic text-[var(--ink)] text-xl` |
| Labels | `text-sm font-medium` | `text-[0.8rem] font-medium text-[var(--ink-soft)]` |
| Inputs / selects fundo | `bg-transparent` / `bg-white dark:bg-zinc-900` | `bg-[var(--gray-table)]` |
| Inputs / selects borda | `border-zinc-200 dark:border-zinc-700` | `border-[var(--gray-border)]` |
| Inputs / selects texto | *(herdado)* | `text-[var(--ink)]` |
| Inputs focus | *(ausente)* | `focus:outline-none focus:border-[var(--burgundy)]` |
| Botão cancelar borda | `border-zinc-200 dark:border-zinc-700` | `border-[var(--gray-border)]` |
| Botão cancelar texto | *(herdado)* | `text-[var(--ink-soft)]` |
| Botão cancelar hover | `hover:bg-zinc-50 dark:hover:bg-zinc-800` | `hover:bg-[var(--blush)]` |
| Botão submit fundo | `bg-[rgb(128,0,32)]` | `bg-[var(--burgundy)]` |
| Botão submit hover | `hover:bg-[rgb(100,0,24)]` | `hover:bg-[var(--burgundy-deep)]` |

Todas as variantes `dark:` são removidas — o site não implementa dark mode nas variáveis CSS.

---

## Arquivos Modificados

- `src/routes/-components/category-modal.tsx` — overlay, container, título, label, input, botões
- `src/routes/-components/present-modal.tsx` — idem + `<select>` recebe mesmas classes dos inputs

## Arquivos Não Modificados

- Lógica de submissão, props, handlers — sem alteração
- `delete-modal.tsx` — fora do escopo
- `src/styles.css` — sem alteração

---

## Critérios de Aceite

- `npx tsc --noEmit` passa sem erros
- `npx eslint src/routes/-components/` passa sem erros
- Nenhum token `zinc-*` ou variante `dark:` restante nos dois arquivos
