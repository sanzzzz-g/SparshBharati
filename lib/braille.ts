export type Language = 'en' | 'hi' | 'ta'
export type BrailleCellData = number[]
export type BrailleResult = { cells: BrailleCellData[]; skipped: string[] }

const EN: Record<string, number[]> = {
  a:[1],b:[1,2],c:[1,4],d:[1,4,5],e:[1,5],f:[1,2,4],g:[1,2,4,5],h:[1,2,5],i:[2,4],j:[2,4,5],k:[1,3],l:[1,2,3],m:[1,3,4],n:[1,3,4,5],o:[1,3,5],p:[1,2,3,4],q:[1,2,3,4,5],r:[1,2,3,5],s:[2,3,4],t:[2,3,4,5],u:[1,3,6],v:[1,2,3,6],w:[2,4,5,6],x:[1,3,4,6],y:[1,3,4,5,6],z:[1,3,5,6],
  '1':[1], '2':[1,2], '3':[1,4], '4':[1,4,5], '5':[1,5], '6':[1,2,4], '7':[1,2,4,5], '8':[1,2,5], '9':[2,4], '0':[2,4,5], ',':[2], "'":[3], '.':[2,5,6], '?':[2,3,5,6], '!':[2,3,5], '-':[3,6], ' ' : [],
}
const HI: Record<string, number[]> = { क:[1,3], ख:[1,2,3], ग:[1,2,4], घ:[1,2,4,5], ङ:[1,2,5], च:[1,4], छ:[1,2,4], ज:[2,4,5], झ:[1,2,4,5], ञ:[2,4], ट:[2,3,4], ठ:[2,3,4,5], ड:[1,4,5], ढ:[1,4,5,6], ण:[1,2,4,5], त:[2,3,4,5], थ:[1,2,3,4], द:[1,2,3,5], ध:[1,2,3,4,5], न:[1,3,4,5], प:[1,2,3,4], फ:[1,2,4,5], ब:[1,2,3,4,5], भ:[1,2,3,4,6], म:[1,3,4], य:[1,3,4,5], र:[1,2,3,5], ल:[1,2,3], व:[1,2,3,6], श:[1,2,4,6], ष:[1,2,3,4,6], स:[2,3,4], ह:[1,2,5], अ:[1], आ:[1,3,5], इ:[2,4], ई:[2,4,5], उ:[1,3,6], ऊ:[1,2,3,6], ए:[1,5], ऐ:[2,3,4,6], ओ:[1,3,5,6], औ:[1,2,3,5,6], ' ':[] }
const TA: Record<string, number[]> = { அ:[1], ஆ:[1,3], இ:[2,4], ஈ:[2,4,5], உ:[1,3,6], ஊ:[1,2,3,6], எ:[1,5], ஏ:[1,2,5], ஐ:[2,3,4,6], ஒ:[1,3,5], ஓ:[1,3,5,6], ஔ:[1,2,3,5,6], க:[1,3], ங:[1,2,5], ச:[1,4], ஞ:[2,4], ட:[2,3,4], ண:[1,2,4,5], த:[2,3,4,5], ந:[1,3,4,5], ப:[1,2,3,4], ம:[1,3,4], ய:[1,3,4,5], ர:[1,2,3,5], ல:[1,2,3], வ:[1,2,3,6], ழ:[1,2,4,6], ள:[1,2,3,4,6], ற:[1,2,3,4,5], ன:[1,3,4,6], ' ':[] }

const tables = { en: EN, hi: HI, ta: TA }
export function dotsToUnicode(dots: number[]) { return String.fromCodePoint(0x2800 + dots.reduce((m, d) => m | (1 << (d - 1)), 0)) }
export function unicodeToDots(char: string) { const mask = char.codePointAt(0)! - 0x2800; return [1,2,3,4,5,6].filter(d => mask & (1 << (d - 1))) }
export function textToBraille(text: string, lang: Language): BrailleResult { const table = tables[lang]; const cells: number[][] = []; const skipped: string[] = []; for (const char of text.normalize('NFC')) { const dots = table[char] ?? table[char.toLowerCase()]; if (dots) cells.push(dots); else if (char === ' ') cells.push([]); else { cells.push(table['?'] ?? [2,3,5,6]); skipped.push(char) } } return { cells, skipped } }
export function brailleToText(cells: number[][], lang: Language) { const table = tables[lang]; return cells.map(cell => { const found = Object.entries(table).find(([, dots]) => dots.join(',') === cell.join(',')); return found?.[0] ?? '?' }).join('') }
export function getBrailleChar(char: string, lang: Language) { return tables[lang][char] }
