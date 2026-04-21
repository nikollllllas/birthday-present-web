# Napkin Runbook

## Curation Rules
- Re-prioritize on every read.
- Keep recurring, high-value notes only.
- Max 10 items per category.
- Each item includes date + "Do instead".

## Execution & Validation (Highest Priority)
1. **[2026-04-20] Tailwind v4 — `@import "tailwindcss"` + `@theme` block**
   Do instead: CSS variables ficam em `:root`, fontes customizadas em `@theme { --font-*: ... }`. Não usar `tailwind.config.js`.

2. **[2026-04-20] `color-mix` em valores arbitrários Tailwind — usar CSS var**
   Do instead: definir `--row-hover: color-mix(...)` em `:root` e referenciar como `hover:bg-[var(--row-hover)]` em vez de tentar escrever `color-mix` diretamente no className.

3. **[2026-04-20] `after:content-['']` em className JSX**
   Do instead: usar template literal para a string de classe quando contém `after:content-['']`, para evitar escaping de aspas simples dentro de string com aspas simples.

## Domain Behavior Guardrails
1. **[2026-04-20] Projeto é lista de presentes de aniversário — rota pública em `/`, admin em `/admin`**
   Do instead: rota `/` é pública (sem auth), `/admin` requer token via `localStorage('admin_token')`.

2. **[2026-04-20] Keyframes e `body::before/after` ficam em CSS, não em Tailwind**
   Do instead: manter `@keyframes`, grain overlay, régua de topo, e background gradients do body em `styles.css`. Tudo mais vai para Tailwind.

## Shell & Command Reliability
1. **[2026-04-20] TypeScript check: `npx tsc --noEmit`**
   Do instead: rodar antes de reportar tarefa concluída.
