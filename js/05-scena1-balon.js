/* ---------- 5. SCENA 1 — BALONUL DE SĂPUN ---------- */
const balon = {
  x: 0, y: 0,
  vx: 0, vy: 0,
  razaBaza: 0,
  faza: Math.random() * Math.PI * 2,
  tinta: { x: 0, y: 0 },
  urmatoareaTinta: 0,
  ultimulChicotit: 0,
  ultimaChemare: 0
};
const urma = [];         // linia lăsată de balon când e urmărit (punctul devine linie!)
let numarEvadari = 0;    // de câte ori a scăpat balonul de sub deget

/* Cât de obosit e balonul, de la 0 la 1. Obosea și înainte — fugea tot mai
   încet, cu fiecare scăpare — dar **nu se vedea**. Jucătorul atingea, balonul
   fugea, și nimic nu-i spunea că se apropie de izbândă: aceeași imagine, aceeași
   fugă, la nesfârșit. Un joc care cere răbdare trebuie să arate că răbdarea
   lucrează, altfel e doar un joc care nu răspunde.

   Aceeași cifră hrănește și fizica, și desenul: dacă ar fi socotită în două
   locuri, balonul ar arăta obosit fără să fie, sau invers. */
/* De cate ori scapa balonul inainte sa se lase prins. Erau trei — se termina
   inainte sa apuci sa citesti definitiile scrise pe fundal, si atunci scrisul
   statea degeaba acolo. Fuga e chiar timpul de citit: cat alergi dupa punct, ai
   sub ochi ce e punctul si ce e linia. */
const EVADARI_PANA_SE_PREDA = 5;

function catDeObositEBalonul() {
  return Math.min(1, numarEvadari / EVADARI_PANA_SE_PREDA);
}

/* Cât de aproape trebuie să atingi ca să-l prinzi. Se lărgește cu fiecare
   scăpare peste prag: cine a avut răbdare până aici n-are voie să rateze din
   milimetri. */
function razaDePrindere() {
  const peste = Math.max(0, numarEvadari - EVADARI_PANA_SE_PREDA);
  return balon.razaBaza * Math.min(2.4, 1 + peste * 0.45);
}

/* Membrana elastică a balonului: conturul e un inel de puncte legate cu
   „arcuri" invizibile. Când degetul apasă, punctele din dreptul lui se
   înfundă; arcurile transmit unda mai departe și balonul tremură ca o
   gelatină vie, apoi se liniștește singur. */
const NUMAR_PUNCTE = 36;
const membrana = [];
function initMembrana() {
  membrana.length = 0;
  for (let i = 0; i < NUMAR_PUNCTE; i++) membrana.push({ o: 0, v: 0 });
}
function actualizeazaMembrana() {
  if (membrana.length === 0) return;
  const raza = balon.razaBaza;
  // ținta de deformare: gropița din dreptul degetului, bombare în rest
  const dxDeget = cursor.x - balon.x, dyDeget = cursor.y - balon.y;
  const distDeget = Math.hypot(dxDeget, dyDeget);
  const apasare = Math.max(0, Math.min(1, (raza * 1.7 - distDeget) / (raza * 0.9)));
  const unghiDeget = Math.atan2(dyDeget, dxDeget);

  for (let i = 0; i < NUMAR_PUNCTE; i++) {
    const a = (i / NUMAR_PUNCTE) * Math.PI * 2;
    let tinta = 0;
    if (apasare > 0) {
      const dif = Math.abs(Math.atan2(Math.sin(a - unghiDeget), Math.cos(a - unghiDeget)));
      tinta = dif < Math.PI / 2
        ? -Math.pow(Math.cos(dif), 3) * 0.32 * apasare * raza   // gropița
        : 0.06 * apasare * raza;                                // bombarea
    }
    const p = membrana[i];
    const vecini = (membrana[(i + 1) % NUMAR_PUNCTE].o + membrana[(i - 1 + NUMAR_PUNCTE) % NUMAR_PUNCTE].o) / 2;
    p.v += (tinta - p.o) * 0.06     // arcul care îl trage spre forma dorită
         + (vecini - p.o) * 0.30;   // vecinii care transmit unda (efectul de gelatină)
    p.v *= 0.90;                    // amortizare, ca tremurul să se stingă lin
  }
  for (const p of membrana) p.o += p.v;
}
// o lovitură scurtă în membrană — balonul „saltă" din piele când e gâdilat
function impulsMembrana(unghi, putere) {
  for (let i = 0; i < NUMAR_PUNCTE; i++) {
    const a = (i / NUMAR_PUNCTE) * Math.PI * 2;
    const dif = Math.abs(Math.atan2(Math.sin(a - unghi), Math.cos(a - unghi)));
    if (dif < Math.PI / 2) membrana[i].v -= Math.pow(Math.cos(dif), 2) * putere;
  }
}

function alegeTintaNoua(acum) {
  const margine = balon.razaBaza * 1.6;
  if (esteAbsent()) {
    balon.tinta.x = margine + Math.random() * (W - margine * 2);
    balon.tinta.y = margine + Math.random() * (H - margine * 2);
  } else {
    const raza = Math.min(W, H) * 0.18;
    balon.tinta.x = W / 2 + (Math.random() * 2 - 1) * raza;
    balon.tinta.y = H / 2 + (Math.random() * 2 - 1) * raza;
  }
  balon.urmatoareaTinta = acum + 2500 + Math.random() * 3000;
}

function actualizeazaBalonul(acum) {
  actualizeazaMembrana();
  if (acum > balon.urmatoareaTinta) alegeTintaNoua(acum);

  balon.vx += (balon.tinta.x - balon.x) * 0.0012;
  balon.vy += (balon.tinta.y - balon.y) * 0.0012;

  // evitarea cursorului — dar cu fiecare evadare balonul obosește puțin,
  // ca utilizatorul să aibă o șansă reală să îl prindă (trecerea spre Scena 2)
  const dx = balon.x - cursor.x;
  const dy = balon.y - cursor.y;
  const distanta = Math.hypot(dx, dy);
  const razaDeFuga = balon.razaBaza * Math.max(2.6 - numarEvadari * 0.2, 1.5);
  if (distanta < razaDeFuga && distanta > 0.001) {
    const oboseala = Math.max(1 - catDeObositEBalonul() * 0.5, 0.4);
    const putere = (1 - distanta / razaDeFuga) * 0.55 * oboseala;
    balon.vx += (dx / distanta) * putere;
    balon.vy += (dy / distanta) * putere;
  }

  const agitatie = factorAgitatie();
  if (agitatie > 0) {
    balon.vx += (Math.random() * 2 - 1) * agitatie * 0.4;
    balon.vy += (Math.random() * 2 - 1) * agitatie * 0.4;
  }

  balon.vx *= 0.955;
  balon.vy *= 0.955;
  balon.x += balon.vx;
  balon.y += balon.vy;

  const m = balon.razaBaza * 1.15;
  if (balon.x < m)     { balon.x = m;     balon.vx = Math.abs(balon.vx) * 0.6; }
  if (balon.x > W - m) { balon.x = W - m; balon.vx = -Math.abs(balon.vx) * 0.6; }
  if (balon.y < m)     { balon.y = m;     balon.vy = Math.abs(balon.vy) * 0.6; }
  if (balon.y > H - m) { balon.y = H - m; balon.vy = -Math.abs(balon.vy) * 0.6; }

  /* Odata gadilat, balonul lasa in urma o linie — punctul devine linie, si asta
     e tot ce are pagina de spus. Inainte urma se stergea din coada dupa vreo doua
     secunde si jumatate: ramanea o codita in urma balonului, nu o linie. Acum
     ramane tot drumul, de la prima fuga incoace, si se vede negru pe alb ca linia
     nu e altceva decat un punct care a mers.

     Punctele prea apropiate nu se mai tin minte: cand balonul abia se clatina, ar
     aduna sute de puncte in acelasi loc fara sa adauge un milimetru de linie. */
  if (numarEvadari >= 1) {
    const ultim = urma[urma.length - 1];
    if (!ultim || Math.hypot(balon.x - ultim.x, balon.y - ultim.y) > 2.5) {
      urma.push({ x: balon.x, y: balon.y });
      if (urma.length > 2600) urma.shift();
    }
  }

  if (esteAbsent() && acum - balon.ultimaChemare > 9000) {
    balon.ultimaChemare = acum;
    if (audio) sunetChemare();
    balon.vy -= 3;
  }
}
