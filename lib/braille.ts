export type Language = 'en' | 'hi' | 'ta'
export type BrailleCellData = number[]
export type BrailleResult = { cells: BrailleCellData[]; skipped: string[] }

const EN: Record<string, number[]> = {
  a:[1],b:[1,2],c:[1,4],d:[1,4,5],e:[1,5],f:[1,2,4],g:[1,2,4,5],h:[1,2,5],i:[2,4],j:[2,4,5],k:[1,3],l:[1,2,3],m:[1,3,4],n:[1,3,4,5],o:[1,3,5],p:[1,2,3,4],q:[1,2,3,4,5],r:[1,2,3,5],s:[2,3,4],t:[2,3,4,5],u:[1,3,6],v:[1,2,3,6],w:[2,4,5,6],x:[1,3,4,6],y:[1,3,4,5,6],z:[1,3,5,6],
  ',':[2],"'": [3],'.':[2,5,6],'?':[2,3,5,6],'!':[2,3,5],'-':[3,6],' ':[],
}
const HI: Record<string, number[]> = { क:[1,3], म:[1,3,4], ' ':[] }
const TA: Record<string, number[]> = { க:[1,3], ம:[1,3,4], ' ':[] }
const tables = { en: EN, hi: HI, ta: TA }

export function dotsToUnicode(dots: number[]) { return String.fromCodePoint(0x2800 + dots.reduce((mask, dot) => mask | (1 << (dot - 1)), 0)) }
export function unicodeToDots(char: string) { const code = char.codePointAt(0); if (code === undefined || code < 0x2800 || code > 0x28ff) return []; const mask = code - 0x2800; return [1,2,3,4,5,6].filter(dot => Boolean(mask & (1 << (dot - 1)))) }
export function textToBraille(text: string, lang: Language): BrailleResult { const table = tables[lang]; const cells: number[][] = []; const skipped: string[] = []; for (const char of text.normalize('NFC')) { const dots = table[char] ?? table[char.toLowerCase()]; if (dots !== undefined) cells.push([...dots]); else { cells.push([2,3,5,6]); skipped.push(char) } } return { cells, skipped } }
export function brailleToText(cells: number[][], lang: Language) { const table = tables[lang]; return cells.map(cell => Object.entries(table).find(([, dots]) => dots.join(',') === [...cell].sort((a,b)=>a-b).join(','))?.[0] ?? '?').join('') }
export function getBrailleChar(char: string, lang: Language) { return tables[lang][char] }
export function brailleToUnicode(cells: number[][]) { return cells.map(dotsToUnicode).join('') }
// TODO: verify full Bharati Hindi/Tamil matras, halant, conjuncts, and uyirmei mappings against the official chart before adding them.
export function mappingForCell(cell: number[], lang: Language) { return Object.entries(tables[lang]).find(([, dots]) => dots.join(',') === [...cell].sort((a,b)=>a-b).join(','))?.[0] }
export const englishMap = EN
export const hindiMap = HI
export const tamilMap = TA

export type { BrailleCellData as Cell }
export const isKnownCell = (cell: number[], lang: Language) => Boolean(mappingForCell(cell, lang))
export const cellUnicode = dotsToUnicode
export const brailleTables = tables
export const textToUnicodeBraille = (text: string, lang: Language) => brailleToUnicode(textToBraille(text, lang).cells)
export const normalizeDots = (dots: Iterable<number>) => [...new Set(dots)].sort((a,b)=>a-b)
export const emptyCell = () => []
export const unknownCell = () => [2,3,5,6]
export const cellKey = (dots: number[]) => normalizeDots(dots).join(',')
export const hasDot = (dots: number[], dot: number) => dots.includes(dot)
export const toggleDot = (dots: number[], dot: number) => hasDot(dots,dot) ? dots.filter(d=>d!==dot) : normalizeDots([...dots,dot])
export const languageLabel = (lang: Language) => ({en:'English',hi:'Hindi',ta:'Tamil'}[lang])
export const supportedLanguages: Language[] = ['hi','ta','en']
export const brailleUnicodeOffset = 0x2800
export const brailleUnicodeRange = { min: 0x2800, max: 0x28ff }
export const dotMask = (dot: number) => 1 << (dot - 1)
export const dotsFromMask = (mask: number) => [1,2,3,4,5,6].filter(dot => mask & dotMask(dot))
export const maskFromDots = (dots: number[]) => dots.reduce((mask,dot)=>mask|dotMask(dot),0)
export const unicodeFromMask = (mask: number) => String.fromCodePoint(brailleUnicodeOffset + mask)
export const maskFromUnicode = (char: string) => (char.codePointAt(0) ?? 0) - brailleUnicodeOffset
export const tableForLanguage = (lang: Language) => tables[lang]
export const textCells = (text: string, lang: Language) => textToBraille(text,lang).cells
export const cellsText = (cells: number[][], lang: Language) => brailleToText(cells,lang)
export const cellsUnicode = (cells: number[][]) => brailleToUnicode(cells)
export const unsupportedMessage = (chars: string[]) => chars.length ? `Unsupported character${chars.length === 1 ? '' : 's'}: ${chars.join(', ')}` : ''
export const cellLabel = (dots: number[]) => dots.length ? `Dots ${normalizeDots(dots).join(', ')}` : 'Blank cell'
export const cellNumbers = (dots: number[]) => normalizeDots(dots).join(',')
export const sameCell = (a: number[], b: number[]) => cellKey(a) === cellKey(b)
export const cloneCell = (dots: number[]) => [...dots]
export const cloneCells = (cells: number[][]) => cells.map(cloneCell)
export const emptyResult = (): BrailleResult => ({cells:[], skipped:[]})
export const mappingCount = (lang: Language) => Object.keys(tables[lang]).length
export const isLanguage = (value: string): value is Language => supportedLanguages.includes(value as Language)
export const tableEntries = (lang: Language) => Object.entries(tables[lang])
export const cellToText = (cell: number[], lang: Language) => mappingForCell(cell,lang) ?? '?'
export const cellsToText = (cells: number[][], lang: Language) => cells.map(c=>cellToText(c,lang)).join('')
export const unicodeCells = (text: string) => [...text].map(unicodeToDots)
export const unicodeToText = (text: string, lang: Language) => brailleToText(unicodeCells(text),lang)
export const textToCells = textCells
export const cellsToUnicode = cellsUnicode
export const cellsToBraille = brailleToUnicode
export const brailleToCells = unicodeCells
export const charToDots = getBrailleChar
export const dotsToChar = dotsToUnicode
export const getLanguageTable = tableForLanguage
export const isUnsupported = (char: string, lang: Language) => tableForLanguage(lang)[char] === undefined
export const getUnsupported = (text: string, lang: Language) => textToBraille(text,lang).skipped
export const getKnown = (text: string, lang: Language) => textToBraille(text,lang).cells
export const version = 'grade-1-reviewed-anchors'

export default textToBraille
