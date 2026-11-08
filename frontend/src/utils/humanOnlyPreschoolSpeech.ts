/** These formulas require an approved human recording; never fall back to device synthesis. */
export function requiresHumanPreschoolRecording(text: string, source?: string): boolean {
  if (source && /values-(bismillah|alhamdulillah)-(prompt|success)\.mp3/.test(source)) return true;
  const plain = text.normalize('NFD').replace(/[\u064B-\u065F\u0670]/g, '').toLowerCase();
  return /بسم الله|الحمد لله|bismi?ll?ah|al[ -]?hamd[ou]+[ -]?li?ll?ah/.test(plain);
}
