/* =====================================================================
   VIAȚA DINTR-O ATINGERE — Scenele 1 și 2
   ---------------------------------------------------------------------
   Structura codului:
     1. Pânza (canvas) și redimensionarea
     2. Cursorul și Algoritmul Cinetic (lent / rapid / absent)
     3. Sunetele (generate din cod, cu Web Audio)
     4. Stările poveștii și funcții de mișcare lină
     5. SCENA 1 — Balonul de săpun (respirație, plutire, evitare, urmă)
     6. SCENA 2 — Mingea de plajă, elefantul-cub și petele de culoare
     7. Atingerile utilizatorului (un singur loc care decide ce se întâmplă)
     8. Desenarea tuturor elementelor
     9. Bucla de animație
   ===================================================================== */

/* ---------- 1. PÂNZA ---------- */
const panza = document.getElementById('panza');
const ctx = panza.getContext('2d');
let W = 0, H = 0;

/* Cât de mare e pânza pe care desenăm de fapt.

   Pe un ecran de patru ori mai mare, fiecare umplere costă de patru ori mai
   mult, iar jocul începe să se târască — nu de la numărul de forme, ci de la
   numărul de pixeli. Așa că desenăm pe o pânză plafonată și o întindem cu CSS
   peste tot ecranul. La un desen pictat, cu margini moi și ceață, diferența nu
   se vede; sacadarea, în schimb, se vede din prima.

   `calitate` coboară singură când cadrele întârzie (vezi reglezaCalitatea) și
   urcă înapoi când lucrurile se liniștesc. */
const PANZA_MAX = 1500 * 850;      // câți pixeli desenăm, cel mult
let scalaPanzei = 1;               // de câte ori e pânza mai mică decât fereastra
let calitate = 1;                  // treapta de calitate, între 0.55 și 1

function redimensioneaza() {
  const lf = Math.max(1, window.innerWidth), inf = Math.max(1, window.innerHeight);
  scalaPanzei = Math.min(1, Math.sqrt(PANZA_MAX / (lf * inf))) * calitate;
  W = panza.width = Math.max(320, Math.round(lf * scalaPanzei));
  H = panza.height = Math.max(240, Math.round(inf * scalaPanzei));
  panza.style.width = '100%';
  panza.style.height = '100%';
}

// La calitate mică lăsăm deoparte podoabele care costă și nu se prea văd.
function detaliuFin() { return calitate > 0.7; }

/* Termometrul de fluență. Ținem media alunecătoare a timpului dintre cadre și,
   dacă jocul începe să se poticnească, coborâm o treaptă de rezoluție. Când
   merge iar lin, o urcăm înapoi. Mai bine puțin mai puțini pixeli decât o
   mișcare sacadată — ochiul iartă rezoluția, nu iartă smuciturile. */
let mediaCadru = 16, ultimulCadruLa = 0, ultimaSchimbare = 0;

function reglezaCalitatea(t) {
  if (ultimulCadruLa) {
    const dt = Math.min(200, t - ultimulCadruLa);
    mediaCadru += (dt - mediaCadru) * 0.06;
  }
  ultimulCadruLa = t;
  if (t - ultimaSchimbare < 2500) return;      // lăsăm o treaptă să se așeze
  if (mediaCadru > 22 && calitate > 0.55) {
    calitate = Math.max(0.55, calitate - 0.15);
  } else if (mediaCadru < 13 && calitate < 1) {
    calitate = Math.min(1, calitate + 0.15);
  } else {
    return;
  }
  ultimaSchimbare = t;
  mediaCadru = 16;
  redimensioneaza();
}
window.addEventListener('resize', redimensioneaza);
redimensioneaza();

// linia orizontului din Scena 2 (cer alb sus, pământ negru jos)
function orizont() { return H * 0.62; }
