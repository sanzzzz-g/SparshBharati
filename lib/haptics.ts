import type { BrailleCellData } from './braille'
export type HapticSpeed = 'slow' | 'normal' | 'fast'
const slots = { slow: 220, normal: 150, fast: 90 }
export function buildPattern(cells: BrailleCellData[], speed: HapticSpeed = 'normal') { const slot = slots[speed]; const output: number[] = []; const push = (value:number) => { if (output.length && (output[output.length-1] === 0) === (value === 0)) output[output.length-1] += value; else output.push(value) }; cells.forEach((cell, index) => { for (let d=1; d<=6; d++) { push(cell.includes(d) ? Math.round(slot*.7) : 0); push(Math.round(slot*.3)) } if (index < cells.length-1) push(slot) }); return output }
export function playPattern(pattern: number[]) { if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(pattern) }
export function stopPattern() { if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(0) }
export const slotDuration = (speed: HapticSpeed) => slots[speed]
