import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: GiftTable })

type Condition = 'disponivel' | 'limitado' | 'esgotado' | 'online'

interface GiftRow {
  present: string
  lugar: string
  condicao: Condition
  condicaoLabel: string
  note?: string
}

interface GiftGroup {
  heading: string
  rows: GiftRow[]
}

const GROUPS: GiftGroup[] = [
  {
    heading: 'Eletônicos & Tecnologia',
    rows: [
      {
        present: 'AirPods Pro (2ª geração)',
        lugar: 'Apple Store / Amazon',
        condicao: 'disponivel',
        condicaoLabel: 'Disponível',
        note: 'R$ 1.899 — frete grátis',
      },
      {
        present: 'Kindle Paperwhite',
        lugar: 'Amazon / Magazine Luiza',
        condicao: 'disponivel',
        condicaoLabel: 'Disponível',
        note: 'R$ 499 — à vista',
      },
      {
        present: 'Carregador MagSafe 15W',
        lugar: 'Apple Store / iPlace',
        condicao: 'limitado',
        condicaoLabel: 'Últimas unidades',
        note: 'R$ 349',
      },
    ],
  },
  {
    heading: 'Moda & Acessórios',
    rows: [
      {
        present: 'Tênis New Balance 990v6',
        lugar: 'New Balance / Dafiti',
        condicao: 'disponivel',
        condicaoLabel: 'Disponível',
        note: 'R$ 1.199 — tam. 42',
      },
      {
        present: 'Carteira em couro mínima',
        lugar: 'Etsy / Elo7',
        condicao: 'online',
        condicaoLabel: 'Somente online',
        note: 'R$ 180 — feita à mão',
      },
      {
        present: 'Boné vintage lavado',
        lugar: 'Urban Outfitters / Farfetch',
        condicao: 'limitado',
        condicaoLabel: 'Estoque limitado',
        note: 'R$ 220',
      },
    ],
  },
  {
    heading: 'Casa & Experiências',
    rows: [
      {
        present: 'Jantar no Loup',
        lugar: 'Rua Delfina, Pinheiros',
        condicao: 'disponivel',
        condicaoLabel: 'Reservas abertas',
        note: 'Para dois — reservar com antecedência',
      },
      {
        present: 'Kit Aeropress + café especial',
        lugar: 'Suplicy / Clandestino Coffee',
        condicao: 'disponivel',
        condicaoLabel: 'Disponível',
        note: 'R$ 380 — combo curado',
      },
      {
        present: 'Livro "Sapiens" (edição ilustrada)',
        lugar: 'Livraria Cultura / Amazon',
        condicao: 'esgotado',
        condicaoLabel: 'Esgotado',
        note: 'Verificar reposição em abril',
      },
      {
        present: 'Vela aromática Maison Margiela',
        lugar: 'Sephora / Farfetch',
        condicao: 'disponivel',
        condicaoLabel: 'Disponível',
        note: 'R$ 590 — REPLICA Jazz Club',
      },
    ],
  },
]

const TOTAL = GROUPS.reduce((n, g) => n + g.rows.length, 0)

/* ─── Rhinestone Heart SVG ─── */
function RhinestoneHeart({ size = 32, uid }: { size?: number; uid: string }) {
  const id = `rh${uid}`
  const H = `M22 40 C22 40 2 26 2 13.5 C2 7.5 6.8 3 12.5 3 C16.5 3 19.8 5.2 22 9 C24.2 5.2 27.5 3 31.5 3 C37.2 3 42 7.5 42 13.5 C42 26 22 40 22 40Z`

  return (
    <svg width={size} height={size} viewBox="0 0 44 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id={`${id}-gl`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <clipPath id={`${id}-clip`}>
          <path d={H}/>
        </clipPath>
      </defs>

      {/* ── base silhouette with outline glow ── */}
      <path d={H} fill="#e8d0e0" filter={`url(#${id}-gl)`}/>

      {/* ══ FACETS (all clipped to heart) ══ */}
      <g clipPath={`url(#${id}-clip)`}>

        {/* ── Left lobe ── */}
        {/* L1 outer-left (deep shadow) */}
        <polygon points="22,9  12.5,3  2,13.5  9,22  22,18" fill="#b07890"/>
        {/* L2 upper highlight */}
        <polygon points="22,9  12.5,3  9,22  22,18"          fill="#f0dce8" opacity="0.7"/>
        {/* L3 bright tip */}
        <polygon points="22,9  12.5,3  17,8"                  fill="#fff8fc"/>
        {/* L4 lower-left dark */}
        <polygon points="9,22  2,13.5  3,21  14,30  22,18"   fill="#c8a0b4"/>

        {/* ── Right lobe ── */}
        {/* R1 outer-right (deep shadow) */}
        <polygon points="22,9  31.5,3  42,13.5  35,22  22,18" fill="#9a6878"/>
        {/* R2 upper mid */}
        <polygon points="22,9  31.5,3  35,22  22,18"           fill="#dcc0d0" opacity="0.7"/>
        {/* R3 tip glint */}
        <polygon points="22,9  31.5,3  27,8"                    fill="#fff0f8"/>
        {/* R4 lower-right */}
        <polygon points="35,22  42,13.5  41,21  30,30  22,18"  fill="#b08898"/>

        {/* ── Bottom section ── */}
        {/* B1 centre-left */}
        <polygon points="22,18  9,22  14,30  22,40"             fill="#d4a8bc"/>
        {/* B2 centre-right */}
        <polygon points="22,18  35,22  30,30  22,40"            fill="#c09aac"/>
        {/* B3 bottom keel bright */}
        <polygon points="22,18  14,30  22,40  30,30"            fill="#e8c8d8"/>
        {/* B4 very bottom tip highlight */}
        <polygon points="18,36  22,40  26,36  22,34"            fill="#fff0f8" opacity="0.8"/>

        {/* ══ FACET EDGE LINES ══ */}
        <g stroke="rgba(90,30,50,0.35)" strokeWidth="0.55" fill="none">
          {/* centre vertical */}
          <line x1="22" y1="9"  x2="22" y2="40"/>
          {/* lobe-to-centre spokes */}
          <line x1="22" y1="9"  x2="9"  y2="22"/>
          <line x1="22" y1="9"  x2="35" y2="22"/>
          <line x1="22" y1="18" x2="9"  y2="22"/>
          <line x1="22" y1="18" x2="35" y2="22"/>
          <line x1="22" y1="18" x2="14" y2="30"/>
          <line x1="22" y1="18" x2="30" y2="30"/>
          {/* outer edge shortcuts */}
          <line x1="9"  y1="22" x2="14" y2="30"/>
          <line x1="35" y1="22" x2="30" y2="30"/>
          <line x1="14" y1="30" x2="22" y2="40"/>
          <line x1="30" y1="30" x2="22" y2="40"/>
          {/* lobe top cuts */}
          <line x1="12.5" y1="3" x2="9"  y2="22"/>
          <line x1="31.5" y1="3" x2="35" y2="22"/>
          <line x1="17"   y1="8" x2="22" y2="18"/>
          <line x1="27"   y1="8" x2="22" y2="18"/>
        </g>

        {/* ══ SPARKLE HIGHLIGHTS ══ */}
        {/* main table shine — upper left lobe */}
        <ellipse cx="13" cy="10" rx="5.5" ry="3.5" fill="white" opacity="0.88"
          transform="rotate(-20,13,10)"/>
        {/* secondary shine — right lobe */}
        <ellipse cx="32" cy="9"  rx="3.5" ry="2.2" fill="white" opacity="0.55"
          transform="rotate(15,32,9)"/>
        {/* bottom bounce */}
        <ellipse cx="22" cy="37" rx="3"   ry="1.5" fill="white" opacity="0.35"/>
        {/* bright dot sparkles */}
        <circle cx="10" cy="7"  r="1.8" fill="white" opacity="0.95"/>
        <circle cx="16" cy="5"  r="1.1" fill="white" opacity="0.80"/>
        <circle cx="31" cy="6"  r="1.2" fill="white" opacity="0.65"/>
        <circle cx="36" cy="11" r="0.9" fill="white" opacity="0.55"/>
        <circle cx="22" cy="34" r="1.0" fill="white" opacity="0.50"/>
        {/* cross-sparkle on main glint */}
        <line x1="10" y1="5"  x2="10" y2="9"  stroke="white" strokeWidth="0.8" opacity="0.7"/>
        <line x1="8"  y1="7"  x2="12" y2="7"  stroke="white" strokeWidth="0.8" opacity="0.7"/>
        <line x1="10" y1="5.5" x2="12" y2="8.5" stroke="white" strokeWidth="0.5" opacity="0.5"/>
        <line x1="8.5" y1="8.5" x2="11.5" y2="5.5" stroke="white" strokeWidth="0.5" opacity="0.5"/>
      </g>

      {/* ── heart outline rim ── */}
      <path d={H} stroke="rgba(120,50,70,0.3)" strokeWidth="0.6" fill="none"/>
    </svg>
  )
}

/* ─── Gold Sequin Star SVG ─── */
// Star geometry is fixed (viewBox always 44×44, cx=cy=22) — hoist outside render
const STAR_S = 44
const STAR_CX = STAR_S / 2
const STAR_CY = STAR_S / 2
const STAR_POINTS = Array.from({ length: 10 }, (_, i) => {
  const angle = (Math.PI * 2 * i) / 10 - Math.PI / 2
  const r = i % 2 === 0 ? 20.5 : 8.5
  return `${(STAR_CX + r * Math.cos(angle)).toFixed(2)},${(STAR_CY + r * Math.sin(angle)).toFixed(2)}`
}).join(' ')
const STAR_INNER_PTS = Array.from({ length: 5 }, (_, i) => {
  const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2 + Math.PI / 5
  return `${(STAR_CX + 8.5 * Math.cos(angle)).toFixed(2)},${(STAR_CY + 8.5 * Math.sin(angle)).toFixed(2)}`
}).join(' ')
const STAR_TIPS = Array.from({ length: 5 }, (_, i) => {
  const a = (Math.PI * 2 * i) / 5 - Math.PI / 2
  return { x: STAR_CX + 20.5 * Math.cos(a), y: STAR_CY + 20.5 * Math.sin(a) }
})

function SequinStar({ size = 20, uid }: { size?: number; uid: string }) {
  const id = `gs${uid}`

  return (
    <svg width={size} height={size} viewBox={`0 0 ${STAR_S} ${STAR_S}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`${id}-g`} cx="36%" cy="30%" r="68%">
          <stop offset="0%"   stopColor="#fffbe0"/>
          <stop offset="22%"  stopColor="#ffe566"/>
          <stop offset="55%"  stopColor="#e6a800"/>
          <stop offset="82%"  stopColor="#b87700"/>
          <stop offset="100%" stopColor="#8a5400"/>
        </radialGradient>
        <linearGradient id={`${id}-sh`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="white" stopOpacity="0.28"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </linearGradient>
        <filter id={`${id}-gl`} x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b"/>
          <feColorMatrix in="b" type="matrix"
            values="1 0.6 0 0 0  0.8 0.5 0 0 0  0 0 0 0 0  0 0 0 0.6 0" result="colored"/>
          <feMerge><feMergeNode in="colored"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <clipPath id={`${id}-clip`}>
          <polygon points={STAR_POINTS}/>
        </clipPath>
      </defs>

      <polygon points={STAR_POINTS} fill="#ffd040" opacity="0.22" filter={`url(#${id}-gl)`}/>
      <polygon points={STAR_POINTS} fill={`url(#${id}-g)`}/>

      <g clipPath={`url(#${id}-clip)`}>
        <polygon points={STAR_POINTS} fill={`url(#${id}-sh)`}/>
        <g stroke="rgba(100,60,0,0.30)" strokeWidth="0.6" fill="none">
          {STAR_TIPS.map((t, i) => (
            <line key={i} x1={STAR_CX} y1={STAR_CY} x2={t.x.toFixed(2)} y2={t.y.toFixed(2)}/>
          ))}
        </g>
        <polygon points={STAR_INNER_PTS} stroke="rgba(100,60,0,0.20)" strokeWidth="0.5" fill="none"/>
        <ellipse cx="17" cy="15" rx="8" ry="5" fill="white" opacity="0.55" transform="rotate(-35,17,15)"/>
        <ellipse cx="20" cy="12" rx="4" ry="2" fill="white" opacity="0.35" transform="rotate(-25,20,12)"/>
      </g>

      <polygon points={STAR_POINTS} stroke="rgba(140,80,0,0.35)" strokeWidth="0.7" fill="none"/>
      {STAR_TIPS.map((t, i) => (
        <circle key={i} cx={t.x} cy={t.y} r="1.6" fill="white" opacity={i === 0 ? 0.92 : 0.55}/>
      ))}
      <line x1={STAR_TIPS[0].x} y1={STAR_TIPS[0].y - 3.5} x2={STAR_TIPS[0].x} y2={STAR_TIPS[0].y + 3.5}
        stroke="white" strokeWidth="0.9" opacity="0.75"/>
      <line x1={STAR_TIPS[0].x - 3.5} y1={STAR_TIPS[0].y} x2={STAR_TIPS[0].x + 3.5} y2={STAR_TIPS[0].y}
        stroke="white" strokeWidth="0.9" opacity="0.75"/>
      <circle cx={STAR_CX} cy={STAR_CY} r="2.5" fill="white" opacity="0.70"/>
    </svg>
  )
}

/* ─── Stickers overlay ─── */
interface StickerDef {
  type: 'heart' | 'star'
  size: number
  top: string
  left?: string
  right?: string
  delay: string
  duration: string
  rotate: string
  opacity: number
}

const STICKERS: StickerDef[] = [
  // Hearts
  { type:'heart', size:34, top:'7%',  left:'2.5%', delay:'0s',    duration:'4.8s', rotate:'-12deg', opacity:0.85 },
  { type:'heart', size:24, top:'18%', right:'3%',  delay:'1.2s',  duration:'5.4s', rotate:'8deg',   opacity:0.78 },
  { type:'heart', size:28, top:'42%', left:'1.2%', delay:'0.6s',  duration:'6.1s', rotate:'-6deg',  opacity:0.80 },
  { type:'heart', size:38, top:'68%', right:'2%',  delay:'2.1s',  duration:'4.6s', rotate:'14deg',  opacity:0.88 },
  { type:'heart', size:22, top:'84%', left:'4%',   delay:'1.7s',  duration:'5.9s', rotate:'-18deg', opacity:0.72 },
  { type:'heart', size:30, top:'91%', right:'7%',  delay:'0.3s',  duration:'5.2s', rotate:'5deg',   opacity:0.82 },
  { type:'heart', size:18, top:'55%', right:'1.5%',delay:'2.8s',  duration:'6.4s', rotate:'-3deg',  opacity:0.65 },
  // Stars
  { type:'star',  size:18, top:'4%',  left:'14%',  delay:'0.4s',  duration:'3.9s', rotate:'20deg',  opacity:0.80 },
  { type:'star',  size:14, top:'13%', right:'14%', delay:'1.5s',  duration:'3.2s', rotate:'-30deg', opacity:0.70 },
  { type:'star',  size:20, top:'29%', left:'2%',   delay:'0.9s',  duration:'4.3s', rotate:'45deg',  opacity:0.75 },
  { type:'star',  size:16, top:'38%', right:'4%',  delay:'2.4s',  duration:'3.7s', rotate:'-15deg', opacity:0.68 },
  { type:'star',  size:22, top:'60%', left:'6%',   delay:'1.1s',  duration:'4.8s', rotate:'60deg',  opacity:0.82 },
  { type:'star',  size:12, top:'73%', right:'11%', delay:'0.7s',  duration:'3.4s', rotate:'-40deg', opacity:0.65 },
  { type:'star',  size:18, top:'88%', left:'16%',  delay:'3.0s',  duration:'4.1s', rotate:'25deg',  opacity:0.72 },
  { type:'star',  size:14, top:'96%', right:'18%', delay:'1.8s',  duration:'3.6s', rotate:'-55deg', opacity:0.60 },
  { type:'star',  size:16, top:'50%', left:'0.5%', delay:'2.2s',  duration:'4.5s', rotate:'35deg',  opacity:0.62 },
]

function Stickers() {
  return (
    <div className="stickers-layer" aria-hidden="true">
      {STICKERS.map((s, i) => {
        const style = {
          top: s.top,
          left: s.left,
          right: s.right,
          '--r':  s.rotate,
          '--op': s.opacity,
          animation: s.type === 'heart'
            ? `heart-float ${s.duration} ${s.delay} ease-in-out infinite`
            : `star-shimmer ${s.duration} ${s.delay} ease-in-out infinite`,
        } as React.CSSProperties & Record<string, unknown>
        return (
          <span key={i} className="sticker" style={style}>
            {s.type === 'heart'
              ? <RhinestoneHeart size={s.size} uid={String(i)} />
              : <SequinStar     size={s.size} uid={String(i)} />
            }
          </span>
        )
      })}
    </div>
  )
}

function GiftTable() {
  return (
    <>
    <Stickers />
    <main className="page-wrap">
      {/* ── Header ── */}
      <header className="page-header fade-up">
        <span className="page-eyebrow">Lista de Presentes</span>
        <h1 className="page-title">
          O que <em>ganhar de presente</em> das lojas no dia do seu aniversário?
        </h1>
        <p className="page-subtitle">lugares, condições e sugestões reunidas num só lugar</p>
        <div className="header-rule" />
      </header>

      {/* ── Table card ── */}
      <div className="table-card fade-up" style={{ animationDelay: '120ms' }}>
        <table className="gift-table">
          <thead>
            <tr>
              <th style={{ width: '30%' }}>Lugares</th>
              <th style={{ width: '35%' }}>Presentes</th>
              <th style={{ width: '35%' }}>Condições</th>
            </tr>
          </thead>

          <tbody>
            {GROUPS.map((group) => (
              <React.Fragment key={group.heading}>
                <tr className="group-row">
                  <td colSpan={3}>{group.heading}</td>
                </tr>
                {group.rows.map((row) => (
                  <tr key={row.present} className="data-row">
                    <td className="cell-lugar">{row.lugar}</td>
                    <td className="cell-present">{row.present}</td>
                    <td>
                      <span className={`cond-badge ${row.condicao}`}>
                        {row.condicaoLabel}
                      </span>
                      {row.note && <p className="cond-note">{row.note}</p>}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Footer legend ── */}
      <footer
        className="table-footer fade-up"
        style={{ animationDelay: '220ms' }}
      >
        <div className="table-legend">
          {(
            [
              ['disponivel', 'Disponível'],
              ['limitado',   'Estoque limitado'],
              ['online',     'Somente online'],
              ['esgotado',   'Esgotado'],
            ] as const
          ).map(([cls, label]) => (
            <span key={cls} className="legend-item">
              <span
                className={`legend-dot cond-badge ${cls}`}
                style={{ padding: 0, border: 'none', width: 10, height: 10 }}
              />
              {label}
            </span>
          ))}
        </div>
        <span className="table-count">
          {TOTAL} sugestões · {GROUPS.length} categorias
        </span>
      </footer>
    </main>
    </>
  )
}
