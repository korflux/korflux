/**
 * Gerador dos SVGs do perfil github.com/korflux.
 *
 * Responsabilidade: produzir todos os arquivos de `assets/` a partir de uma
 * única fonte de tokens de marca e de conteúdo. O README só referencia o que
 * sai daqui; nenhum SVG de `assets/` é editado à mão.
 *
 * Uso: `npm run build` (Node 20+, sem dependências).
 *
 * Restrições do GitHub que moldam este arquivo:
 * - README não aceita CSS nem JS; o visual inteiro precisa estar em imagens.
 * - SVG carregado por <img> não busca recursos externos: a foto do hero entra
 *   em base64 e as fontes são as do sistema de quem visualiza.
 * - Tema claro/escuro do GitHub só é respeitado por <picture> com
 *   `prefers-color-scheme` no README, por isso cada peça sai em duas variantes
 *   (`-dark.svg` e `-light.svg`). O hero é exceção: a foto é escura e ele é único.
 *
 * Seções: 1) tokens  2) conteúdo  3) helpers  4) peças  5) escrita em disco
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'assets');

// ───────────────────────────── 1) Tokens de marca ─────────────────────────────
// Valores espelham src/styles/variables.css do site korflux.com.br.
const BRAND = { green: '#15cb18', greenDeep: '#127031', navy: '#050517', offWhite: '#eff2f1' };

const THEMES = {
  dark: {
    panel: '#0b0c1f',
    panelSoft: '#111323',
    border: '#2a2a54',
    text: '#eff2f1',
    muted: '#9a9aad',
    accent: BRAND.green,
    chipBg: '#15172b',
    glow: 0.2,
  },
  light: {
    panel: '#ffffff',
    panelSoft: '#f4f6f5',
    border: '#cfd8d4',
    text: '#050517',
    muted: '#5c5a57',
    accent: BRAND.greenDeep,
    chipBg: '#eef2f0',
    glow: 0.12,
  },
};

// ponytail: fontes do sistema, porque SVG em <img> não carrega webfont externa.
// Embutir a Plus Jakarta Sans em base64 só se a diferença de tipografia incomodar.
const SANS = "'Plus Jakarta Sans','Segoe UI',system-ui,-apple-system,'Helvetica Neue',Arial,sans-serif";
const MONO = "ui-monospace,'SFMono-Regular','SF Mono',Consolas,'Liberation Mono',Menlo,monospace";
/** Largura média de um caractere monoespaçado, em em. Usada para dimensionar chips. */
const MONO_EM = 0.62;

// Símbolo da marca (Marca/icon.svg), viewBox 293.75 x 350.
const ICON_PATH =
  'M171.88,326.65l-50,23.35v-131.25l-53.87,32.41L0,233.59l98.44-58.59L0,115.62l25.78-42.19,96.09,57.03V0h50v130.47l96.09-57.03,25.78,42.97-98.44,58.59,98.44,58.59-25.78,42.97-96.09-57.81v107.9Z';

// Logotipo completo (Marca/logo-full-dark.svg), viewBox 350 x 87.93: símbolo + letras.
const LOGO_ICON =
  'M30.62,5.87L43.18,0v32.97l13.53-8.14,17.08,4.41-24.73,14.72,24.73,14.92-6.48,10.6-24.14-14.33v32.78h-12.56v-32.78l-24.14,14.33L0,58.68l24.73-14.72L0,29.24l6.48-10.79,24.14,14.52V5.87Z';
const LOGO_TEXT = `
<polygon points="130.86 31.15 118.24 31.15 102.28 47.85 102.28 19.36 92.14 14.65 92.14 73.27 102.28 73.27 102.28 60.42 107.74 54.56 119.55 73.27 131.17 73.27 115.29 48.11 130.86 31.15"/>
<path d="M167.87,33.08c-3.36-1.91-7.1-2.87-11.23-2.87s-7.95.96-11.31,2.87c-3.36,1.91-6.03,4.52-8.01,7.82-1.99,3.3-2.98,7.07-2.98,11.31s.99,8,2.98,11.31c1.99,3.3,4.67,5.91,8.05,7.82,3.38,1.91,7.14,2.87,11.27,2.87s7.79-.95,11.15-2.87c3.36-1.91,6.04-4.52,8.05-7.82,2.01-3.3,3.02-7.07,3.02-11.31s-.99-8.07-2.98-11.34c-1.99-3.28-4.66-5.87-8.01-7.78ZM166.75,58.75c-1.01,1.94-2.38,3.45-4.1,4.53-1.73,1.08-3.73,1.63-6,1.63s-4.36-.54-6.12-1.63c-1.76-1.08-3.14-2.59-4.14-4.53-1.01-1.94-1.51-4.12-1.51-6.54s.5-4.66,1.51-6.54c1.01-1.88,2.39-3.38,4.14-4.49,1.75-1.11,3.79-1.66,6.12-1.66s4.27.56,6,1.66c1.73,1.11,3.1,2.61,4.1,4.49,1.01,1.88,1.51,4.07,1.51,6.54s-.5,4.61-1.51,6.54Z"/>
<path d="M199.89,33.01c-1.61.95-2.88,2.47-3.83,4.55v-6.41h-9.52v42.13h10.14v-23c0-3.2.88-5.69,2.63-7.47,1.75-1.78,4.08-2.67,6.97-2.67h3.64v-8.98h-2.48c-2.94,0-5.46.62-7.55,1.86Z"/>
<path d="M292.78,55.85c0,1.86-.36,3.46-1.08,4.8-.72,1.34-1.73,2.39-3.02,3.14-1.29.75-2.76,1.12-4.41,1.12s-3.14-.37-4.45-1.12c-1.32-.75-2.32-1.78-3.02-3.1-.7-1.32-1.05-2.85-1.05-4.61v-24.93h-10.14v25.79c0,3.46.63,6.48,1.9,9.06,1.26,2.58,3.1,4.6,5.5,6.04,2.4,1.44,5.23,2.17,8.48,2.17,2.99,0,5.61-.65,7.86-1.94,1.69-.97,3.01-2.3,3.99-4v5h9.6V31.15h-10.14v24.7Z"/>
<polygon points="350 31.15 338.15 31.15 329.29 44.24 324 36.44 308.49 31.15 323.28 52.13 308.57 73.27 320.5 73.27 329.29 60.18 338.07 73.27 349.92 73.27 335.29 52.13 350 31.15"/>
<path d="M240.3,31.15h-9.78v-1.39c0-2.12.62-3.68,1.86-4.68,1.24-1.01,2.99-1.51,5.27-1.51.36,0,.76.01,1.2.04.44.03.92.09,1.43.19v-8.75c-.52-.1-1.15-.19-1.9-.27-.75-.08-1.43-.12-2.05-.12-3.25,0-6.07.59-8.44,1.78-2.38,1.19-4.22,2.9-5.54,5.15-1.32,2.25-1.97,4.97-1.97,8.17v1.39h-7.43v9.06h7.43v33.07h10.14v-33.07h13.16l-3.38-9.06Z"/>
<rect x="246.88" y="14.65" width="10.2" height="58.62"/>`;

// ──────────────────────────────── 2) Conteúdo ────────────────────────────────
// Fonte única dos textos que aparecem nas imagens. O README repete parte deles
// em `alt` e em links de texto; ao mudar aqui, confira o README.
const HERO = {
  label: '$ boot ./perfil --user korflux',
  name: 'Marco Kormoczi',
  tagline: 'Branding & IA · Marketing e Growth · Otimização de Fluxo',
  chips: ['gerente de marketing', 'vibecoder', 'são paulo, br'],
};

/** Linhas do terminal. `kind`: cmd (comando digitado), out (saída), accent (saída em destaque). */
const TERMINAL = [
  { kind: 'cmd', text: 'cat sobre.txt' },
  { kind: 'out', text: 'Gerente de Marketing e VibeCoder. 10+ anos entre marca, growth e produto.' },
  { kind: 'out', text: 'Hoje desenho e publico software com agentes de IA.' },
  { kind: 'cmd', text: 'ls foco/' },
  { kind: 'accent', text: 'branding/   growth/   automacao/   agentes-ia/   open-source/' },
  { kind: 'cmd', text: './status --agora' },
  { kind: 'out', text: 'construindo: aion · vibeflow · kastir · movia' },
];

// Ordem dos cards no README: Aion, vibeflow, Kastir e MovIA (o site segue no hero e no contato).
const PROJECTS = [
  {
    slug: 'aion',
    title: 'Aion',
    tag: 'bots autônomos · source-available',
    desc: 'Bots auto-hospedados com memória, rotinas e conectores. Rodam no seu servidor e pedem aprovação antes de agir.',
    chips: ['TypeScript', 'Fastify', 'PWA'],
  },
  {
    slug: 'vibeflow',
    title: 'vibeflow',
    tag: 'skill para agentes · MIT',
    desc: 'Skill com um coordenador-líder que planeja, delega a subagentes e confere cada entrega, em qualquer cliente que leia SKILL.md.',
    chips: ['SKILL.md', 'Node', 'zero deps'],
  },
  {
    slug: 'kastir',
    title: 'Kastir',
    tag: 'micro-cms · fair source',
    desc: 'Micro-CMS para páginas geradas por IA. Cole o HTML, publique como arquivo estático e deixe agentes operarem via MCP.',
    chips: ['Next.js', 'PostgreSQL', 'MCP'],
  },
  {
    slug: 'movia',
    title: 'MovIA',
    tag: 'editor de vídeo · fair source',
    desc: 'Editor de vídeo que agentes de IA operam pela CLI. Você revisa e aprova no navegador, e a versão final sai do plano aprovado.',
    chips: ['Python', 'FFmpeg', 'CLI'],
  },
];

const SECTIONS = [
  { slug: 'projetos', index: '01', title: 'projetos' },
  { slug: 'stack', index: '02', title: 'stack' },
  { slug: 'contato', index: '03', title: 'contato' },
];

const STACK = [
  { label: 'produto', items: ['TypeScript', 'Next.js', 'Astro', 'Fastify', 'Node.js', 'Python'] },
  { label: 'dados e infra', items: ['PostgreSQL', 'Redis', 'Docker', 'Nginx', 'self-hosted'] },
  { label: 'ia e automação', items: ['Claude Code', 'MCP', 'agentes', 'n8n', 'Composio'] },
  { label: 'marca', items: ['Branding', 'Design estratégico', 'WordPress', 'WooCommerce'] },
];

const LINKS = [
  { slug: 'site', text: 'korflux.com.br', primary: true },
  { slug: 'whatsapp', text: 'whatsapp' },
  { slug: 'linkedin', text: 'linkedin' },
  { slug: 'instagram', text: 'instagram' },
  { slug: 'behance', text: 'behance' },
];

// ──────────────────────────────── 3) Helpers ─────────────────────────────────
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const svg = (w, h, title, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(title)}">
<title>${esc(title)}</title>
${body}
</svg>
`;

/** Quebra texto em linhas de até `max` caracteres, sem cortar palavras. */
function wrap(text, max) {
  const lines = [];
  let line = '';
  for (const word of text.split(' ')) {
    if (line && (line + ' ' + word).length > max) {
      lines.push(line);
      line = word;
    } else {
      line = line ? line + ' ' + word : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

const chipWidth = (text, size, padX) => Math.ceil(text.length * size * MONO_EM + padX * 2);

/**
 * Fileira de chips monoespaçados a partir de (x, y), com y no topo do chip.
 * Retorna o markup e a largura total, para quem precisa alinhar algo depois.
 */
function chipRow(items, x, y, t, { size = 15, padX = 14, h = 32, gap = 10 } = {}) {
  let cx = x;
  let out = '';
  for (const item of items) {
    const w = chipWidth(item, size, padX);
    out += `<rect x="${cx}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${t.chipBg}" stroke="${t.border}"/>
<text x="${cx + w / 2}" y="${y + h / 2 + size * 0.35}" text-anchor="middle" font-family="${MONO}" font-size="${size}" fill="${t.text}">${esc(item)}</text>
`;
    cx += w + gap;
  }
  return { markup: out, width: cx - gap - x };
}

/** Símbolo da marca com altura `h`, canto superior esquerdo em (x, y). */
const icon = (x, y, h, fill, extra = '') =>
  `<path transform="translate(${x} ${y}) scale(${(h / 350).toFixed(4)})" d="${ICON_PATH}" fill="${fill}" ${extra}/>`;

/** Todas as animações param para quem pede movimento reduzido. */
const REDUCED_MOTION = `@media (prefers-reduced-motion: reduce){*{animation:none!important}}`;

// ───────────────────────────────── 4) Peças ──────────────────────────────────

/**
 * Hero: foto da marca à direita, gradiente navy cobrindo a esquerda para dar
 * contraste ao texto, grade e linhas de fluxo animadas. Tema único (escuro).
 */
function hero(photoBase64) {
  const W = 1280;
  const H = 452;
  const chips = chipRow(HERO.chips, 64, 348, { ...THEMES.dark, chipBg: 'rgba(5,5,23,0.72)' });
  return svg(
    W,
    H,
    `${HERO.name}. ${HERO.tagline}.`,
    `<defs>
<clipPath id="frame"><rect width="${W}" height="${H}" rx="28"/></clipPath>
<linearGradient id="fade" x1="0" x2="1" y1="0" y2="0">
<stop offset="0" stop-color="${BRAND.navy}"/>
<stop offset="0.42" stop-color="${BRAND.navy}" stop-opacity="0.94"/>
<stop offset="0.68" stop-color="${BRAND.navy}" stop-opacity="0.35"/>
<stop offset="1" stop-color="${BRAND.navy}" stop-opacity="0.05"/>
</linearGradient>
<linearGradient id="floor" x1="0" x2="0" y1="0" y2="1">
<stop offset="0.6" stop-color="${BRAND.navy}" stop-opacity="0"/>
<stop offset="1" stop-color="${BRAND.navy}" stop-opacity="0.85"/>
</linearGradient>
<radialGradient id="orb" cx="0.12" cy="0.1" r="0.6">
<stop offset="0" stop-color="${BRAND.green}" stop-opacity="0.22"/>
<stop offset="1" stop-color="${BRAND.green}" stop-opacity="0"/>
</radialGradient>
<pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
<path d="M48 0H0V48" fill="none" stroke="${BRAND.offWhite}" stroke-opacity="0.06"/>
</pattern>
<style>
.flux{fill:none;stroke:${BRAND.green};stroke-linecap:round;stroke-dasharray:6 22;animation:flow 9s linear infinite}
.flux.b{stroke-dasharray:2 30;animation-duration:14s;opacity:.6}
.cursor{animation:blink 1.1s steps(1) infinite}
@keyframes flow{to{stroke-dashoffset:-560}}
@keyframes blink{50%{opacity:0}}
${REDUCED_MOTION}
</style>
</defs>
<g clip-path="url(#frame)">
<rect width="${W}" height="${H}" fill="${BRAND.navy}"/>
<image href="data:image/webp;base64,${photoBase64}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice"/>
<rect width="${W}" height="${H}" fill="url(#fade)"/>
<rect width="${W}" height="${H}" fill="url(#floor)"/>
<rect width="${W}" height="${H}" fill="url(#grid)"/>
<rect width="${W}" height="${H}" fill="url(#orb)"/>
<path class="flux" stroke-width="2" d="M-20 430 C 260 380, 420 452, 700 412 S 1100 380, 1300 420"/>
<path class="flux b" stroke-width="2" d="M-20 404 C 240 440, 480 372, 760 426 S 1120 430, 1300 392"/>
<g transform="translate(64 56) scale(0.6)">
<path d="${LOGO_ICON}" fill="${BRAND.green}"/>
<g fill="${BRAND.offWhite}">${LOGO_TEXT}</g>
</g>
<text x="64" y="196" font-family="${MONO}" font-size="19" fill="${BRAND.green}">${esc(HERO.label)}<tspan class="cursor"> ▍</tspan></text>
<text x="62" y="266" font-family="${SANS}" font-size="66" font-weight="800" letter-spacing="-1.5" fill="${BRAND.offWhite}">${esc(HERO.name)}</text>
<text x="64" y="310" font-family="${SANS}" font-size="22" font-weight="500" fill="${BRAND.offWhite}" fill-opacity="0.82">${esc(HERO.tagline)}</text>
${chips.markup}
</g>
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="28" fill="none" stroke="${BRAND.offWhite}" stroke-opacity="0.12"/>`,
  );
}

/**
 * Terminal: cada linha é "digitada" por uma tarja da cor do painel que desliza
 * para a direita em passos (um por caractere). Roda uma vez e para no fim, e
 * com movimento reduzido as tarjas simplesmente somem.
 */
function terminal(t) {
  const W = 1280;
  const PAD = 44;
  const TOP = 104;
  const LH = 38;
  const SIZE = 20;
  const H = TOP + TERMINAL.length * LH + LH + 28;
  const MS_PER_CHAR = 28;

  let delay = 500;
  let rows = '';
  let css = '';
  TERMINAL.forEach((line, i) => {
    const y = TOP + i * LH;
    const isCmd = line.kind === 'cmd';
    const full = isCmd ? `$ ${line.text}` : line.text;
    // Saída aparece rápido (como texto impresso); comando é digitado.
    const duration = isCmd ? full.length * MS_PER_CHAR : 220;
    const steps = isCmd ? full.length : 6;
    const fill = line.kind === 'accent' ? t.accent : line.kind === 'out' ? t.muted : t.text;
    const prompt = isCmd ? `<tspan fill="${t.accent}">$ </tspan>` : '';
    rows += `<text x="${PAD}" y="${y}" font-family="${MONO}" font-size="${SIZE}" fill="${fill}" xml:space="preserve">${prompt}${esc(line.text)}</text>
<rect class="veil v${i}" x="${PAD - 4}" y="${y - SIZE - 4}" width="${W}" height="${LH}" fill="${t.panel}"/>
`;
    css += `.v${i}{animation:type ${duration}ms steps(${steps},end) ${delay}ms forwards}\n`;
    delay += duration + (isCmd ? 260 : 120);
  });
  const lastY = TOP + TERMINAL.length * LH;

  return svg(
    W,
    H,
    'Terminal marco@korflux: Gerente de Marketing e VibeCoder, 10+ anos entre marca, growth e produto. Foco em branding, growth, automação, agentes de IA e open source. Construindo aion, vibeflow, kastir e movia.',
    `<defs>
<clipPath id="win"><rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="22"/></clipPath>
<style>
@keyframes type{to{transform:translateX(${W}px)}}
@keyframes blink{50%{opacity:0}}
@keyframes show{to{opacity:1}}
.end{opacity:0;animation:show 1ms linear ${delay}ms forwards}
.cursor{animation:blink 1.1s steps(1) infinite}
${css}@media (prefers-reduced-motion: reduce){.veil{display:none}.end{opacity:1}*{animation:none!important}}
</style>
</defs>
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="22" fill="${t.panel}" stroke="${t.border}" stroke-width="2"/>
<g clip-path="url(#win)">
<rect x="1" y="1" width="${W - 2}" height="56" fill="${t.panelSoft}"/>
<rect x="1" y="56" width="${W - 2}" height="2" fill="${t.border}"/>
<circle cx="40" cy="29" r="7" fill="#e5484d"/><circle cx="64" cy="29" r="7" fill="#e5b703"/><circle cx="88" cy="29" r="7" fill="#53b262"/>
<text x="${W / 2}" y="35" text-anchor="middle" font-family="${MONO}" font-size="16" fill="${t.muted}">marco@korflux:~</text>
${rows}<g class="end"><text x="${PAD}" y="${lastY}" font-family="${MONO}" font-size="${SIZE}" fill="${t.accent}">$ <tspan class="cursor" fill="${t.text}">▍</tspan></text></g>
</g>`,
  );
}

/** Cartão de projeto, pensado para ir em dupla (49% de largura cada) no README. */
function projectCard(p, t) {
  const W = 600;
  const H = 300;
  const lines = wrap(p.desc, 52);
  const desc = lines
    .map((l, i) => `<text x="36" y="${150 + i * 27}" font-family="${SANS}" font-size="18" fill="${t.muted}">${esc(l)}</text>`)
    .join('\n');
  const chips = chipRow(p.chips, 36, 236, t);
  return svg(
    W,
    H,
    `${p.title}: ${p.desc}`,
    `<defs>
<clipPath id="card"><rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="22"/></clipPath>
<radialGradient id="glow" cx="1" cy="0" r="0.75">
<stop offset="0" stop-color="${BRAND.green}" stop-opacity="${t.glow}"/>
<stop offset="1" stop-color="${BRAND.green}" stop-opacity="0"/>
</radialGradient>
</defs>
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="22" fill="${t.panel}" stroke="${t.border}" stroke-width="2"/>
<g clip-path="url(#card)">
<rect width="${W}" height="${H}" fill="url(#glow)"/>
${icon(504, 30, 62, BRAND.green, 'fill-opacity="0.9"')}
</g>
<text x="36" y="56" font-family="${MONO}" font-size="15" fill="${t.accent}">${esc(p.tag)}</text>
<text x="35" y="108" font-family="${SANS}" font-size="40" font-weight="800" letter-spacing="-0.8" fill="${t.text}">${esc(p.title)}</text>
${desc}
${chips.markup}`,
  );
}

/** Cabeçalho de seção: índice, título e uma linha que some para a direita. */
function sectionHeader(s, t) {
  const W = 1280;
  const H = 64;
  const label = `${s.index}  / ${s.title}`;
  const lineStart = 28 + Math.ceil(label.length * 26 * MONO_EM) + 28;
  return svg(
    W,
    H,
    s.title,
    `<defs><linearGradient id="rule" x1="0" x2="1"><stop offset="0" stop-color="${t.border}"/><stop offset="1" stop-color="${t.border}" stop-opacity="0"/></linearGradient></defs>
${icon(0, 20, 24, BRAND.green)}
<text x="34" y="42" font-family="${MONO}" font-size="26" font-weight="700" fill="${t.text}" xml:space="preserve"><tspan fill="${t.accent}">${s.index}</tspan>  / ${esc(s.title)}</text>
<rect x="${lineStart + 6}" y="32" width="${W - lineStart - 6}" height="2" fill="url(#rule)"/>`,
  );
}

/** Stack em linhas rotuladas: rótulo à esquerda, chips à direita. */
function stack(t) {
  const W = 1280;
  const ROW = 58;
  const H = 40 + STACK.length * ROW + 10;
  const rows = STACK.map((group, i) => {
    const y = 34 + i * ROW;
    return `<text x="36" y="${y + 24}" font-family="${MONO}" font-size="17" fill="${t.accent}">${esc(group.label)}</text>
${chipRow(group.items, 250, y, t, { size: 17, padX: 16, h: 36, gap: 12 }).markup}`;
  }).join('\n');
  return svg(
    W,
    H,
    STACK.map((g) => `${g.label}: ${g.items.join(', ')}`).join('. '),
    `<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="22" fill="${t.panel}" stroke="${t.border}" stroke-width="2"/>
${rows}`,
  );
}

/** Botão de contato em pílula. O primário é preenchido com o verde da marca. */
function linkPill(l, t) {
  const SIZE = 18;
  const H = 52;
  const text = `${l.text} ↗`;
  const W = chipWidth(text, SIZE, 26);
  const fill = l.primary ? BRAND.green : t.panel;
  const color = l.primary ? BRAND.navy : t.text;
  const stroke = l.primary ? BRAND.green : t.border;
  return svg(
    W,
    H,
    l.text,
    `<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="${(H - 2) / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
<text x="${W / 2}" y="${H / 2 + SIZE * 0.35}" text-anchor="middle" font-family="${MONO}" font-size="${SIZE}" font-weight="${l.primary ? 700 : 500}" fill="${color}">${esc(text)}</text>`,
  );
}

/** Rodapé: duas ondas de fluxo animadas e o símbolo girando devagar no centro. */
function footer(t) {
  const W = 1280;
  const H = 150;
  return svg(
    W,
    H,
    'korflux: marca, produto e fluxo',
    `<defs>
<linearGradient id="edge" x1="0" x2="1">
<stop offset="0" stop-color="${t.accent}" stop-opacity="0"/><stop offset="0.5" stop-color="${t.accent}"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/>
</linearGradient>
<style>
.wave{fill:none;stroke:url(#edge);stroke-width:2;stroke-linecap:round;stroke-dasharray:8 18;animation:flow 10s linear infinite}
.wave.b{stroke-dasharray:2 24;animation-duration:16s;opacity:.7}
.spin{transform-box:fill-box;transform-origin:center;animation:spin 24s linear infinite}
@keyframes flow{to{stroke-dashoffset:-520}}
@keyframes spin{to{transform:rotate(360deg)}}
${REDUCED_MOTION}
</style>
</defs>
<path class="wave" d="M0 52 C 200 12, 380 92, 580 52"/>
<path class="wave" d="M700 52 C 900 12, 1080 92, 1280 52"/>
<path class="wave b" d="M0 60 C 220 96, 400 24, 580 60"/>
<path class="wave b" d="M700 60 C 880 24, 1060 96, 1280 60"/>
<g class="spin">${icon(640 - 21, 30, 50, BRAND.green)}</g>
<text x="${W / 2}" y="128" text-anchor="middle" font-family="${MONO}" font-size="17" fill="${t.muted}">korflux · marca, produto e fluxo</text>`,
  );
}

// ──────────────────────────── 5) Escrita em disco ────────────────────────────
const files = new Map();
const photo = (await readFile(join(ROOT, 'brand', 'marco-banner.webp'))).toString('base64');
files.set('hero.svg', hero(photo));

for (const [name, t] of Object.entries(THEMES)) {
  files.set(`terminal-${name}.svg`, terminal(t));
  files.set(`stack-${name}.svg`, stack(t));
  files.set(`footer-${name}.svg`, footer(t));
  for (const p of PROJECTS) files.set(`card-${p.slug}-${name}.svg`, projectCard(p, t));
  for (const s of SECTIONS) files.set(`section-${s.slug}-${name}.svg`, sectionHeader(s, t));
  for (const l of LINKS) files.set(`link-${l.slug}-${name}.svg`, linkPill(l, t));
}

await mkdir(OUT, { recursive: true });
for (const [name, content] of files) await writeFile(join(OUT, name), content, 'utf8');
console.log(`${files.size} arquivos gerados em assets/`);
