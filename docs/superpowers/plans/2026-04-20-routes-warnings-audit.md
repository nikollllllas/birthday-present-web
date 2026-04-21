# Routes Warnings Audit — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminar todos os warnings e erros de lint/tipagem nos arquivos `src/routes/` e garantir que o TanStack Router esteja configurado sem lacunas de componentes obrigatórios.

**Architecture:** Cada task corrige uma categoria de problema independente. Nenhuma task depende da anterior — podem ser executadas em qualquer ordem. A task final faz o audit completo para confirmar estado limpo.

**Tech Stack:** TypeScript 5, React 19, TanStack Router (latest), ESLint (`@tanstack/eslint-config`)

---

## Achados do audit inicial

| Arquivo | Ferramenta | Problema |
|---|---|---|
| `src/routes/index.tsx:3` | ESLint `import/consistent-type-specifier-style` | `type` inline em import misto deve virar `import type` separado |
| `src/routes/__root.tsx` | TanStack Router runtime | `errorComponent` não configurado — erro não tratado renderiza tela genérica |

`notFoundComponent` já foi corrigido anteriormente e **não** aparece nos achados.

---

## Task 1: Corrigir import inline de tipo em `index.tsx`

**Files:**
- Modify: `src/routes/index.tsx:3`

**Contexto:** A regra `import/consistent-type-specifier-style` do ESLint exige que imports de tipo usem `import type { ... }` no nível superior, não `{ type X }` dentro de um import misto.

- [ ] **Step 1: Confirmar o erro atual**

```bash
npx eslint src/routes/index.tsx
```

Saída esperada:
```
src/routes/index.tsx
  3:23  error  Prefer using a top-level type-only import instead of inline type specifiers  import/consistent-type-specifier-style
✖ 1 problem (1 error, 0 warnings)
```

- [ ] **Step 2: Separar o import de tipo**

Em `src/routes/index.tsx`, substituir a linha 3:

```ts
// antes
import { usePresents, type ConditionValue } from '../lib/api/queries'

// depois
import type { ConditionValue } from '../lib/api/queries'
import { usePresents } from '../lib/api/queries'
```

- [ ] **Step 3: Verificar que não há erro de TypeScript**

```bash
npx tsc --noEmit
```

Saída esperada: nenhuma saída (zero erros).

- [ ] **Step 4: Verificar que o lint passou**

```bash
npx eslint src/routes/index.tsx
```

Saída esperada: nenhuma saída (zero problemas).

- [ ] **Step 5: Commit**

```bash
git add src/routes/index.tsx
git commit -m "fix: use top-level import type for ConditionValue"
```

---

## Task 2: Adicionar `errorComponent` ao root route

**Files:**
- Modify: `src/routes/__root.tsx`

**Contexto:** O TanStack Router emite warning em runtime quando uma rota lança erro mas não encontra `errorComponent` configurado. O root route é o lugar certo para definir um fallback global, igual ao `notFoundComponent` que já foi adicionado.

A função `ErrorComponent` recebe `{ error: Error }` via prop e deve estar tipada com `ErrorComponentProps` do `@tanstack/react-router`.

- [ ] **Step 1: Importar `ErrorComponentProps`**

Em `src/routes/__root.tsx`, adicionar `ErrorComponentProps` ao import existente:

```ts
// antes
import { HeadContent, Scripts, createRootRoute, Link } from '@tanstack/react-router'

// depois
import { HeadContent, Scripts, createRootRoute, Link, type ErrorComponentProps } from '@tanstack/react-router'
```

> Nota: `type ErrorComponentProps` usa inline specifier — separar se o ESLint reclamar (mesmo padrão da Task 1).

- [ ] **Step 2: Criar o componente `RouteError`**

Adicionar antes de `function NotFound()` em `src/routes/__root.tsx`:

```tsx
function RouteError({ error }: ErrorComponentProps) {
  return (
    <main className="relative z-[1] flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p className="inline-block tracking-[0.22em] uppercase text-[0.6rem] font-semibold text-[var(--burgundy)] border border-[rgba(128,0,32,0.3)] px-[1.1em] py-[0.3em] rounded-[2px] mb-6">
        Erro
      </p>
      <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-bold text-[var(--ink)] leading-tight mb-3">
        Algo deu errado
      </h1>
      <p className="text-[0.95rem] text-[var(--ink-faint)] font-light mb-2">
        {error.message}
      </p>
      <Link
        to="/"
        className="text-[0.85rem] font-medium text-[var(--burgundy)] underline underline-offset-4 hover:opacity-70"
      >
        Voltar para a lista
      </Link>
    </main>
  )
}
```

- [ ] **Step 3: Registrar no `createRootRoute`**

```ts
// antes
export const Route = createRootRoute({
  ...
  notFoundComponent: NotFound,
})

// depois
export const Route = createRootRoute({
  ...
  notFoundComponent: NotFound,
  errorComponent: RouteError,
})
```

- [ ] **Step 4: Verificar TypeScript**

```bash
npx tsc --noEmit
```

Saída esperada: nenhuma saída.

- [ ] **Step 5: Verificar lint**

```bash
npx eslint src/routes/__root.tsx
```

Saída esperada: nenhuma saída, ou um erro `import/consistent-type-specifier-style` para `ErrorComponentProps` — se aparecer, separar em `import type { ErrorComponentProps }` na linha acima do import de valor, igual à Task 1.

- [ ] **Step 6: Commit**

```bash
git add src/routes/__root.tsx
git commit -m "feat: add errorComponent fallback to root route"
```

---

## Task 3: Audit final — confirmar estado limpo

**Files:** nenhum modificado — só leitura/execução.

- [ ] **Step 1: Lint em todo src/routes/**

```bash
npx eslint src/routes/
```

Saída esperada: nenhuma saída (zero problemas).

- [ ] **Step 2: TypeScript em todo o projeto**

```bash
npx tsc --noEmit
```

Saída esperada: nenhuma saída.

- [ ] **Step 3: Lint em todo src/ para garantir que nenhuma task introduziu regressão**

```bash
npx eslint src/
```

Saída esperada: nenhuma saída.
