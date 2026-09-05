/* ---------- 4. STĂRILE POVEȘTII ----------
   'intuneric'    → ecran negru, așteptăm prima atingere      (Scena 1)
   'crestere'     → punctul alb crește și devine balon        (Scena 1)
   'balon'        → balonul plutește, râde, fuge, lasă urmă   (Scena 1→2)
   'transformare' → balonul prins devine minge, lumea se împarte (Scena 2)
   'minge'        → mingea se joacă, elefantul se plimbă      (Scena 2) */
let stare = 'intuneric';
let inceputulCresterii = 0;
const DURATA_CRESTERII = 4000;
let inceputulTransformarii = 0;

/* A doua oară prin jucărie, elefantul e roz.

   Șoapta din sala a douăsprezecea promite asta — „promit că data viitoare
   elefantul va fi roz" — iar o promisiune făcută jucătorului și neținută e mai
   rea decât o glumă nespusă. Întâi în text scria „albastru", ceea ce nu însemna
   nimic: elefantul **este** albastru de la bun început, deci gluma promitea că
   totul rămâne la fel. Roz e altceva — și se și vede. */
let elefantulERoz = false;
const DURATA_TRANSFORMARII = 3400;

// atenuare lină (pornește încet, se termină încet)
function atenuare(p) {
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
}
// cădere cu ricoșeu, ca o minge adevărată care aterizează
function ricoseu(p) {
  const n1 = 7.5625, d1 = 2.75;
  if (p < 1 / d1)   return n1 * p * p;
  if (p < 2 / d1)   return n1 * (p -= 1.5 / d1) * p + 0.75;
  if (p < 2.5 / d1) return n1 * (p -= 2.25 / d1) * p + 0.9375;
  return n1 * (p -= 2.625 / d1) * p + 0.984375;
}
function intre(a, b, p) { return a + (b - a) * p; }   // interpolare simplă
