export type AlertId = 'doorbell' | 'fire' | 'calling' | 'horn'
export const ALERTS: Record<AlertId, { label: string; description: string; pattern: number[] }> = {
  doorbell: { label:'Doorbell', description:'Someone is at the door', pattern:[180,120,180,260] },
  fire: { label:'Fire alarm', description:'Rapid alternating warning', pattern:[420,100,180,100,420,100,180,100] },
  calling: { label:'Someone calling', description:'Three slow pulses', pattern:[300,260,300,260,300,400] },
  horn: { label:'Vehicle horn', description:'One long pulse', pattern:[700,400] },
}
export function pulseCount(pattern: number[]) { return pattern.filter((_,i)=>i%2===0).length }
