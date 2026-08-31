/* ---------- 2. CURSORUL ȘI ALGORITMUL CINETIC ----------
   Măsurăm viteza cursorului (pixeli pe milisecundă):
     - lentă  → contemplare: lumină caldă, forme calme
     - rapidă → agitație: formele tremură, devin nervoase
     - absentă (peste 6 secunde) → autonomie: lumea trăiește singură */
const cursor = {
  x: -9999, y: -9999,
  viteza: 0,                       // viteza netezită, în px/ms
  ultimaMiscare: performance.now()
};
let pozitiaAnterioara = null;
let timpulAnterior = 0;

window.addEventListener('pointermove', (e) => {
  const acum = performance.now();
  if (pozitiaAnterioara) {
    const dt = Math.max(acum - timpulAnterior, 1);
    const distanta = Math.hypot(e.clientX * scalaPanzei - pozitiaAnterioara.x,
                                e.clientY * scalaPanzei - pozitiaAnterioara.y);
    const vitezaBruta = distanta / dt;
    // netezim viteza, ca să nu sară brusc de la un cadru la altul
    cursor.viteza += (vitezaBruta - cursor.viteza) * 0.15;
  }
  pozitiaAnterioara = { x: e.clientX * scalaPanzei, y: e.clientY * scalaPanzei };
  timpulAnterior = acum;
  // fereastra e în pixeli de ecran, pânza poate fi mai mică: aducem degetul
  // în coordonatele în care desenăm
  cursor.x = e.clientX * scalaPanzei;
  cursor.y = e.clientY * scalaPanzei;
  cursor.ultimaMiscare = acum;
});

// Cât de „calm" e utilizatorul: 1 = contemplare, 0 = agitație
function factorCalm() {
  return Math.max(0, Math.min(1, 1 - cursor.viteza / 0.6));
}
// Cât de „agitat" e utilizatorul: 0 = liniștit, 1 = foarte rapid
function factorAgitatie() {
  return Math.max(0, Math.min(1, (cursor.viteza - 0.8) / 1.4));
}
// Utilizatorul a lăsat mouse-ul? (peste 6 secunde fără mișcare)
function esteAbsent() {
  return performance.now() - cursor.ultimaMiscare > 6000;
}

/* Degetul e ținut minte în pixeli de pânză. Dacă pânza își schimbă mărimea și
   mâna stă pe loc, punctul rămâne unde era în măsura veche — iar tot ce se ia
   după deget (balonul care fuge, cercelul care se lasă spre el, lupa) se duce
   după o fantomă, până la prima mișcare a mâinii. */
laRedimensionare.push(function (kx, ky) {
  if (cursor.x > -9000) { cursor.x *= kx; cursor.y *= ky; }
  if (pozitiaAnterioara) { pozitiaAnterioara.x *= kx; pozitiaAnterioara.y *= ky; }
});
