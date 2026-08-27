/* ---------- 8. DESENAREA ---------- */

// Fundalul Scenei 1: negru care se deschide treptat spre gri neutru
function deseneazaFundal(progres) {
  const luminozitate = Math.round(122 * progres);
  ctx.fillStyle = `rgb(${luminozitate}, ${luminozitate}, ${luminozitate})`;
  ctx.fillRect(0, 0, W, H);
}

/* ---------- DESCHIDEREA, ÎN TREI PAGINI ----------
   Ecranul negru nu spune nimic de la sine, iar cine intră prima oară n-are de
   unde ști că e o jucărie. Dar nici nu i se pot pune trei lucruri deodată în
   față. Așa că se întorc trei pagini, ca la o carte: întâi titlul singur, apoi
   ce fel de lucru e, apoi mânuța care cheamă. A treia rămâne până o atingi. */

/* Cât stă fiecare pagină. A doua e cea mai lungă: are două fraze de citit, iar
   cine citește mai încet trebuie să apuce să le termine. Oricum, o atingere
   pornește jocul din orice pagină — nimeni nu e obligat să aștepte. */
const PAGINI_INVITATIE = [
  { de: 800,   pana: 4400 },      // titlul, de tipar
  { de: 4400,  pana: 11200 },     // ce fel de jucărie e
  { de: 11200, pana: Infinity }   // mânuța și îndemnul
];

/* Paginile se întorc și singure, după ceas, dar și la atingere. Fără asta, cine
   atinge ecranul din prima curiozitate — și așa face oricine — pornea jocul de
   pe pagina întâi și nu vedea niciodată ce scrie mai departe.

   Săritura mută ceasul înainte, la începutul paginii următoare, în loc să țină
   un număr de pagină separat: așa tot restul rămâne socotit din timp, ca până
   acum, și nu se schimbă nimic altundeva. */
let sarituraInvitatie = 0;

function ceasulInvitatiei(t) { return t + sarituraInvitatie; }

function paginaInvitatiei(t) {
  const tp = ceasulInvitatiei(t);
  for (let k = 0; k < PAGINI_INVITATIE.length; k++) {
    if (tp < PAGINI_INVITATIE[k].pana) return k;
  }
  return PAGINI_INVITATIE.length - 1;
}

// Întoarce foaia. Întoarce false dacă suntem deja pe ultima — atunci atingerea
// înseamnă „începe".
function intoarcePagina(t) {
  const k = paginaInvitatiei(t);
  if (k >= PAGINI_INVITATIE.length - 1) return false;
  sarituraInvitatie += PAGINI_INVITATIE[k].pana - ceasulInvitatiei(t) + 1;
  return true;
}

function alfaPagina(t, p) {
  if (t < p.de || t > p.pana) return 0;
  const intra = Math.min(1, (t - p.de) / 650);
  const iese = p.pana === Infinity ? 1 : Math.min(1, (p.pana - t) / 650);
  return Math.max(0, Math.min(intra, iese));
}

/* Titlul e cules ca pe o pagină de gardă: literele răsfirate, două filete
   subțiri deasupra și dedesubt. Răsfirarea o face browserul dacă știe;
   dacă nu, titlul rămâne întreg, doar mai strâns. */
function titluDeTipar(text, cx, cy, marime, spatiu, alfa) {
  ctx.save();
  ctx.font = `${marime}px Georgia`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = `rgba(246, 238, 224, ${alfa})`;
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${Math.round(spatiu)}px`;
  const lat = ctx.measureText(text).width;
  ctx.fillText(text, cx, cy);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
  ctx.restore();

  const filet = Math.min(W * 0.34, lat * 0.62);
  ctx.strokeStyle = `rgba(214, 200, 178, ${alfa * 0.5})`;
  ctx.lineWidth = 1;
  for (const dy of [-marime * 1.15, marime * 1.15]) {
    ctx.beginPath();
    ctx.moveTo(cx - filet, cy + dy);
    ctx.lineTo(cx + filet, cy + dy);
    ctx.stroke();
  }
}
