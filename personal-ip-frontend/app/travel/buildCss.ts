interface YPos {
  x: number; y: number; size: number; dur: number; delay: number; rot: number
}
interface CssItem {
  year: number
  pos: YPos
}

const GOOGLE_FONTS = "@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Barlow:wght@400;500&display=swap');"

export function buildTravelCss(items: CssItem[]): string {
  const keyframes = items.map(({ year, pos }) => {
    const r = pos.rot
    const s = pos.size
    const frames = [
      '0%   { transform: translate(0px, 0px) rotate(' + r + 'deg); }',
      '25%  { transform: translate(' + (s * 0.09).toFixed(3) + 'px, ' + (-s * 0.07).toFixed(3) + 'px) rotate(' + (r + 0.9) + 'deg); }',
      '50%  { transform: translate(' + (-s * 0.06).toFixed(3) + 'px, ' + (s * 0.10).toFixed(3) + 'px)  rotate(' + (r - 0.6) + 'deg); }',
      '75%  { transform: translate(' + (s * 0.08).toFixed(3) + 'px, ' + (s * 0.06).toFixed(3) + 'px)  rotate(' + (r + 0.4) + 'deg); }',
      '100% { transform: translate(' + (-s * 0.05).toFixed(3) + 'px, ' + (-s * 0.08).toFixed(3) + 'px) rotate(' + r + 'deg); }',
    ].join('\n  ')
    return '@keyframes drift-' + year + ' {\n  ' + frames + '\n}'
  }).join('\n')

  return [
    GOOGLE_FONTS,
    keyframes,
    '@keyframes fadeUp {',
    '  from { opacity:0; transform: translateX(-50%) translateY(8px); }',
    '  to   { opacity:1; transform: translateX(-50%) translateY(0); }',
    '}',
  ].join('\n')
}
