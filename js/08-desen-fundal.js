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
/* ---------- SCRISUL ÎNTINS ----------
   Uneltele astea stăteau lângă fișele de sală, în fișierul galeriei. Dar scrisul
   întins nu e al galeriei, e al oricărui text din jucărie — iar fundalul, care se
   încarcă mai devreme, nu-l putea folosi. Locul unui lucru de care are nevoie
   toată lumea e sus, nu acolo unde s-a nimerit să fie scris prima oară. */

/* Scrie un rând întins de la o margine la alta, cum stă scrisul într-o carte:
   spațiile dintre cuvinte se lărgesc toate deopotrivă, cât să iasă rândul fix
   pe lățimea dată. Ultimul rând al unui paragraf rămâne cum e — întins, ar avea
   trei cuvinte răsfirate pe toată lățimea, și s-ar vedea că e forțat.

   Nici rândurile care ar trebui prea tare întinse nu se justifică: dacă golul
   dintre cuvinte iese de trei ori cât unul obișnuit, scrisul se rărește în
   dâre albe — „râuri", cum le zic tipografii — și se citește mai greu decât
   dacă l-ai fi lăsat în pace. */
function scrieIntins(c, rand, x, y, latime, ultimul) {
  const cuvinte = rand.split(' ');
  if (ultimul || cuvinte.length < 2) { c.fillText(rand, x, y); return; }
  let latCuvinte = 0;
  for (const cuv of cuvinte) latCuvinte += c.measureText(cuv).width;
  const gol = (latime - latCuvinte) / (cuvinte.length - 1);
  if (gol > c.measureText(' ').width * 3.2) { c.fillText(rand, x, y); return; }
  let cx = x;
  for (const cuv of cuvinte) {
    c.fillText(cuv, cx, y);
    cx += c.measureText(cuv).width + gol;
  }
}

// Rupe un text în rânduri, la o lățime dată, cu fontul deja pus pe `c`.
function randuriIncapute(c, text, latime) {
  const cuvinte = String(text).split(' ');
  const randuri = [];
  let rand = '';
  for (const cuv of cuvinte) {
    const incercare = rand ? rand + ' ' + cuv : cuv;
    if (c.measureText(incercare).width > latime && rand) { randuri.push(rand); rand = cuv; }
    else rand = incercare;
  }
  if (rand) randuri.push(rand);
  return randuri;
}

/* Fișa nu e un carton agățat pe perete: e **pictată pe perete**, ca o inscripție
   murală. Are câmpul ei de tencuială, mai deschis decât mătasea din jur, un
   chenar tras cu pensula în ocru și câte o voluță în creștet și în poale. Litera
   e de pigment: se scrie de două ori, o dată cu un ton stins și lat, o dată
   peste, curat — așa arată un scris zugrăvit, nu unul tipărit.

   Mărimea literei se alege singură, cât să încapă în câmp: un text scris la
   mărime fixă fie iese din chenar, fie rămâne cu jumătate de panou gol sub el. */

/* ---------- DEFINIȚIILE DE PE FUNDAL ----------
   Jucăria e despre elementele limbajului plastic, iar fiecare scenă naște câte
   unul: punctul, linia lăsată de el, pata de culoare de sub minge. Definițiile
   stau scrise pe fundal, în spatele lucrului pe care îl numesc — nu într-o
   fereastră care se deschide peste joc.

   Se scriu cu o cerneală abia vizibilă: cine vrea le citește, cine nu se joacă
   mai departe. Un text de manual pus tare peste o jucărie o face temă de casă. */
const DEFINITIE_PUNCT =
  'Punctul este cel mai simplu element de limbaj vizual, reprezentând urma ' +
  'lăsată de un instrument pe o suprafață și centrul dinamic din care se ' +
  'dezvoltă o compoziție.';

const DEFINITIE_LINIE =
  'Linia este elementul vizual unidimensional ce ia naștere prin mișcarea ' +
  'continuă a unui punct pe o suprafață, având rolul de a contura forme, de a ' +
  'exprima direcție și de a reda dinamism.';

const DEFINITIE_PATA =
  'Pata de culoare este o suprafață bine delimitată de pigment aplicată pe un ' +
  'suport, care creează efecte decorative, spațiale sau expresive în cadrul ' +
  'unei compoziții plastice.';

/* Un bloc de text așezat pe fundal, rupt singur în rânduri.

   `ancora` spune ce înseamnă `y`: „sus" e capătul de sus al blocului, „mijloc" e
   mijlocul lui, „jos" e capătul de jos. Fără ea, ca să așezi un text pe linia
   orizontului trebuia să-i ghicești dinainte câte rânduri iese — și ghiceala se
   strica la fiecare cuvânt schimbat. Așa, textul se rupe întâi și se așază pe
   urmă. */
function definitiePeFundal(text, cx, y, lat, marime, culoare, titlu, ancora) {
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = `${marime}px Georgia`;

  const randuri = randuriIncapute(ctx, text, lat);

  const inaltTitlu = titlu ? marime * 1.9 : 0;
  const inaltTot = inaltTitlu + randuri.length * marime * 1.42;
  let sus = y;
  if (ancora === 'mijloc') sus = y - inaltTot / 2;
  else if (ancora === 'jos') sus = y - inaltTot;

  const stx = cx - lat / 2;
  let cy = sus;
  if (titlu) {
    ctx.font = `bold ${Math.round(marime * 1.15)}px Georgia`;
    ctx.fillStyle = culoare;
    let tx = stx;
    for (const litera of String(titlu).toUpperCase()) {
      ctx.fillText(litera, tx, cy);
      tx += ctx.measureText(litera).width + marime * 0.18;
    }
    cy += inaltTitlu;
  }
  /* Rândurile se întind de la o margine la alta, ca într-o carte: marginea din
     dreapta zdrențuită face dintr-un text așezat pe fundal o listă, nu un
     paragraf. Ultimul rând rămâne cum e — întins, ar avea două cuvinte răsfirate
     pe toată lățimea. */
  ctx.font = `${marime}px Georgia`;
  ctx.fillStyle = culoare;
  for (let k = 0; k < randuri.length; k++) {
    scrieIntins(ctx, randuri[k], stx, cy, lat, k === randuri.length - 1);
    cy += marime * 1.42;
  }
  ctx.restore();
  return cy;
}

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

/* Spargerea balonului din foaia a treia. Cât timp e null, balonul plutește și
   dă din degete; din clipa atingerii ține minte când a pocnit, iar jocul
   pornește abia după ce s-au risipit cioburile. Ochiul trebuie să apuce să vadă
   ce a făcut mâna lui — altfel atingerea și nașterea punctului se suprapun, și
   nu se înțelege că una a produs-o pe cealaltă. */
const DURATA_POCNETULUI = 620;
let pocnetulBalonului = null;

function spargeBalonulManutei(acum) {
  if (pocnetulBalonului !== null) return false;
  pocnetulBalonului = acum;
  if (audio) sunetPoc();
  return true;
}

// Cât de departe a ajuns spargerea, de la 0 la 1.
function catAPocnit(acum) {
  if (pocnetulBalonului === null) return 0;
  return Math.min(1, (acum - pocnetulBalonului) / DURATA_POCNETULUI);
}

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
