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

/* Cine vrea să afle că pânza și-a schimbat mărimea își lasă aici un bilet.

   Scenele își țin socoteli în pixeli de pânză — unde atârnă cercelul, cât e de
   mare, unde a căzut plicul. Când pânza își schimbă mărimea sub ele, socotelile
   rămân din lumea veche: cercelul zboară în dreapta ecranului și lănțișorul lui
   se întinde peste toată grădina. Așa că, la fiecare redimensionare, fiecare
   scenă e chemată să-și mute lucrurile în noua măsură. */
const laRedimensionare = [];

/* Multe mărimi din desen sunt scrise în pixeli rotunzi: „cartea are cel mult
   470 de pixeli". Dar pânza pe care desenăm nu e ecranul: e o pânză mai mică,
   întinsă cu CSS peste el, și cu atât mai mică cu cât calculatorul se îneacă
   mai tare. Un 470 lăsat așa nu se micșorează odată cu ea — și cartea, care pe
   un ecran mare era o palmă, ajunge să acopere jumătate de lume.

   `ecran(470)` înseamnă „470 de pixeli de-ai ecranului", socotiți în pixeli
   de-ai pânzei. Atât cât trebuie ca desenul să arate la fel, oricât de tare a
   coborât calitatea. */
function ecran(n) { return n * scalaPanzei; }

function redimensioneaza() {
  const Wv = W, Hv = H;
  const lf = Math.max(1, window.innerWidth), inf = Math.max(1, window.innerHeight);
  scalaPanzei = Math.min(1, Math.sqrt(PANZA_MAX / (lf * inf))) * calitate;
  W = panza.width = Math.max(320, Math.round(lf * scalaPanzei));
  H = panza.height = Math.max(240, Math.round(inf * scalaPanzei));
  panza.style.width = '100%';
  panza.style.height = '100%';
  if (Wv && Hv && (Wv !== W || Hv !== H)) {
    for (const anunta of laRedimensionare) anunta(W / Wv, H / Hv, Wv, Hv);
  }
}

// La calitate mică lăsăm deoparte podoabele care costă și nu se prea văd.
function detaliuFin() { return calitate > 0.7; }

/* Termometrul de fluență. Ținem media alunecătoare a timpului dintre cadre și,
   dacă jocul începe să se poticnească, coborâm o treaptă de rezoluție. Când
   merge iar lin, o urcăm înapoi. Mai bine puțin mai puțini pixeli decât o
   mișcare sacadată — ochiul iartă rezoluția, nu iartă smuciturile. */
let mediaCadru = 16, ultimulCadruLa = 0, ultimaSchimbare = 0;
/* Cea mai bună treaptă la care avem voie să urcăm. Pornește de la 1 și coboară
   pentru totdeauna dacă se dovedește că mașina n-o duce. */
let plafonCalitate = 1, aUrcatUltima = false;

function reglezaCalitatea(t) {
  if (ultimulCadruLa) {
    const dt = Math.min(200, t - ultimulCadruLa);
    mediaCadru += (dt - mediaCadru) * 0.06;
  }
  ultimulCadruLa = t;

  /* Cât așteptăm între două trepte. Când jocul merge cât de cât, lăsăm două
     secunde și jumătate, ca o treaptă să se așeze înainte s-o judecăm. Dar când
     un cadru ține peste patruzeci de milisecunde — adică sub douăzeci și cinci de
     cadre pe secundă, atât cât să se simtă în deget — nu mai e nimic de așteptat:
     coborâm imediat, și dintr-odată cu două trepte.

     Înainte era un singur prag pentru amândouă situațiile, și pe un calculator
     care chiar se îneca trebuiau vreo șapte secunde și jumătate de smucituri ca
     să ajungă la treapta de jos. Cele șapte secunde alea sunt tocmai timpul în
     care omul crede că jucăria e stricată. */
  const seIneaca = mediaCadru > 40;
  if (t - ultimaSchimbare < (seIneaca ? 600 : 2500)) return;
  if (mediaCadru > 22 && calitate > 0.55) {
    /* A trebuit să coborâm. Dacă tocmai urcaserăm, înseamnă că treapta de sus
       nu se ține pe calculatorul ăsta: o închidem, ca să nu ne mai întoarcem la
       ea. Altfel jucăria urcă, se îneacă, coboară, urcă iar — la nesfârșit, și
       de fiecare dată repictează grădina și sala. Balansul ăsta e chiar lagul. */
    if (aUrcatUltima) plafonCalitate = Math.max(0.55, calitate - 0.15);
    calitate = Math.max(0.55, calitate - (seIneaca ? 0.3 : 0.15));
    aUrcatUltima = false;
  } else if (mediaCadru < 13 && calitate < plafonCalitate) {
    calitate = Math.min(plafonCalitate, calitate + 0.15);
    aUrcatUltima = true;
  } else {
    return;
  }
  ultimaSchimbare = t;
  redimensioneaza();
  /* Cadrul în care se schimbă treapta e cel mai scump din toată jucăria: cu
     pânza schimbată, fundalul grădinii și sala galeriei se repictează de la
     zero, într-o singură clipă. Dacă îl punem la socoteala fluenței, el singur
     ne spune că jocul se îneacă — și coborâm încă o treaptă, care iar
     repictează tot. Așa că nu-l măsurăm: uităm ceasul și pornim media curată. */
  mediaCadru = 16;
  ultimulCadruLa = 0;
}

/* Cât timp tragi de colțul ferestrei sosesc zeci de „resize" pe secundă, și
   fiecare ar repicta din temelii grădina și sala. Așteptăm să se oprească mâna
   și abia pe urmă redesenăm o singură dată. */
let ceasRedimensionare = 0;
window.addEventListener('resize', () => {
  clearTimeout(ceasRedimensionare);
  ceasRedimensionare = setTimeout(() => { redimensioneaza(); mediaCadru = 16; ultimulCadruLa = 0; }, 120);
});
redimensioneaza();

// linia orizontului din Scena 2 (cer alb sus, pământ negru jos)
function orizont() { return H * 0.62; }
