import type { ErrorComponentProps } from '@tanstack/react-router'
import {
  HeadContent,
  Scripts,
  createRootRoute,
  Link,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Footer from '../components/Footer'

import appCss from '../styles.css?url'

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Lista de Presentes',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
  errorComponent: RouteError,
})

function RouteError({ error }: ErrorComponentProps) {
  return (
    <main className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p className="inline-block tracking-[0.22em] uppercase text-[0.6rem] font-semibold text-(--burgundy) border border-[rgba(128,0,32,0.3)] px-[1.1em] py-[0.3em] rounded-xs mb-6">
        Erro
      </p>
      <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-bold text-(--ink) leading-tight mb-3">
        Algo deu errado
      </h1>
      <p className="text-[0.95rem] text-(--ink-faint) font-light mb-2">
        {error.message}
      </p>
      <Link
        to="/"
        className="text-[0.85rem] font-medium text-(--burgundy) underline underline-offset-4 hover:opacity-70"
      >
        Voltar para a lista
      </Link>
    </main>
  )
}

function NotFound() {
  return (
    <main className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p className="inline-block tracking-[0.22em] uppercase text-[0.6rem] font-semibold text-(--burgundy) border border-[rgba(128,0,32,0.3)] px-[1.1em] py-[0.3em] rounded-xs mb-6">
        404
      </p>
      <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-bold text-[--ink] leading-tight mb-3">
        Página não encontrada
      </h1>
      <p className="text-[0.95rem] text-(--ink-faint) font-light mb-8">
        O endereço que você acessou não existe.
      </p>
      <Link
        to="/"
        className="text-[0.85rem] font-medium text-(--burgundy) underline underline-offset-4 hover:opacity-70"
      >
        Voltar para a lista
      </Link>
    </main>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased wrap-anywhere selection:bg-[rgba(128,0,32,0.15)]">
        <QueryClientProvider client={queryClient}>
          {children}
          <Footer />
          <TanStackDevtools
            config={{ position: 'bottom-right' }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
          <Scripts />
        </QueryClientProvider>
      </body>
    </html>
  )
}
