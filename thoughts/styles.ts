/* ═══════════════════════════════════════════════
   Thoughts Page — Complete Styles
   ═══════════════════════════════════════════════ */

const CSS_LINES = [
  /* ── Fonts ── */
  "@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Barlow:wght@300;400;500&family=Caveat:wght@600&family=Noto+Serif+SC:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');",

  /* ── Navigation override (thoughts page only) ── */
  '[data-thoughts-page] nav.fixed { transform: none !important; background: transparent; transition: background 0.4s ease, box-shadow 0.4s ease; }',
  '[data-thoughts-page].thoughts-scrolled nav.fixed { background: #fff9f0; box-shadow: 0 1px 8px rgba(0,0,0,0.04); }',

  /* ── Masonry ── */
  '.thoughts-masonry { columns: 3; column-gap: 16px; }',
  '.thought-card { break-inside: avoid; margin-bottom: 16px; display: inline-block; width: 100%; }',

  /* ── Card hover ── */
  '.thought-card { transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease, border-color 0.4s ease; cursor: default; }',
  '.thought-card:hover { transform: translateY(-6px); box-shadow: 0 12px 24px rgba(46,26,14,0.08); border-color: #C45A30 !important; }',
  '.thought-card:active { transform: translateY(-2px); box-shadow: 0 2px 8px rgba(46,26,14,0.05); }',
  '.thought-card-code:hover { transform: translateY(-6px); box-shadow: 0 12px 24px rgba(0,0,0,0.35); border-color: rgba(200,160,110,0.35) !important; }',
  '.thought-card-code:active { transform: translateY(-2px); box-shadow: 0 2px 8px rgba(0,0,0,0.2); }',

  /* ── Card hover image zoom ── */
  '.thought-card-img { transition: transform 0.4s ease; }',
  '.thought-card:hover .thought-card-img { transform: scale(1.03); }',

  /* ── Tag pill hover ── */
  '.thought-tag { transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease; cursor: pointer; }',
  '.thought-tag:hover { background: #E8855A; color: #fff; transform: scale(1.05); }',
  '.thought-tag:active { background: #C45A30; }',
  '.thought-tag-dark { transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease; cursor: pointer; }',
  '.thought-tag-dark:hover { background: #C9A96E; color: #1A1208; transform: scale(1.05); }',

  /* ── Interaction icon bounce ── */
  '@keyframes iconBounce { 0% { transform: scale(1); } 40% { transform: scale(1.3); } 100% { transform: scale(1); } }',
  '.icon-bounce { animation: iconBounce 0.3s ease; }',

  '@keyframes numPop { 0% { transform: scale(1); } 40% { transform: scale(1.2); } 100% { transform: scale(1); } }',
  '.num-pop { animation: numPop 0.3s ease; }',

  /* ── Card enter animation ── */
  '@keyframes cardEnter { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }',
  '.card-enter { animation: cardEnter 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }',

  /* ── Divider expand ── */
  '@keyframes dividerExpand { from { width: 0; } to { width: 100%; } }',
  '.divider-expand { animation: dividerExpand 0.6s ease both; }',

  /* ── Loading dots ── */
  '@keyframes dotPulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1); } }',
  '.loading-dot { width: 8px; height: 8px; border-radius: 50%; background: #E8855A; display: inline-block; margin: 0 4px; }',
  '.loading-dot:nth-child(1) { animation: dotPulse 0.8s ease infinite 0s; }',
  '.loading-dot:nth-child(2) { animation: dotPulse 0.8s ease infinite 0.15s; }',
  '.loading-dot:nth-child(3) { animation: dotPulse 0.8s ease infinite 0.3s; }',

  /* ── Code block scrollbar ── */
  '.code-pre::-webkit-scrollbar { height: 3px; }',
  '.code-pre::-webkit-scrollbar-thumb { background: #3A2A1A; border-radius: 2px; }',

  /* ── Responsive ── */
  '@media (max-width: 900px) { .thoughts-masonry { columns: 2; } }',
  '@media (max-width: 540px) { .thoughts-masonry { columns: 1; } }',
]

export const pageCss = CSS_LINES.join('\n')
