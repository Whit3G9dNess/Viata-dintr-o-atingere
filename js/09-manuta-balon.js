/* ---------- MÂNUȚA ----------
   Nu e o mână desenată cu tuș, ci una umflată: o mănușă de gală făcută balon,
   dintr-o singură foiță străvezie, cu nod și ață. Nu are contur negru și nu are
   cusături — un balon nu se coase din bucăți.

   Se vede prin ea, ca prin balonul de săpun din scena următoare: marginea e
   aprinsă, fiindcă acolo privirea trece prin cea mai multă foiță, iar prin
   mijloc trece aproape numai noaptea din spate. Peste tot, trei pete de curcubeu
   care se plimbă alene și câteva sclipiri unde albul e plin. */
const ALB_MANUSA = '#ffffff';

/* Fiecare bucată nu deschide un drum nou: le adunăm pe toate într-un singur
   contur și îl umplem o dată. Regula „nonzero" umple reuniunea lor exact o
   dată, așa că suprapunerile nu se văd și transparența nu se dublează. De-aici
   iese mănușa dintr-o bucată — un balon, nu un desen încheiat din petice.
   Fiecare bucată e trasată în același sens, altfel suprapunerea ar face gaură.

   `e` e subțierea: cu cât e mai mare, cu atât conturul se strânge spre miez.
   Cu ea scobim înăuntrul balonului, ca marginea să rămână singura aprinsă. */

/* Un deget: de la bază spre vârf, rotit în jurul bazei. Poate fi mai lat la
   bază decât în vârf — degetul mare are nevoie de asta. Un deget de aceeași
   grosime pe toată lungimea, lipit oblic de o palmă, lasă la îmbinare un colț
   ascuțit, iar colțul acela se citește ca o ruptură. Baza lată intră în palmă
   ca o rădăcină, și cele două se fac un singur trup. */
function degetManusa(c, bx, by, lung, gros, unghi, grosBaza) {
  const gb = grosBaza || gros;
  c.save();
  c.translate(bx, by);
  c.rotate(unghi);
  c.moveTo(-gb / 2, 0);
  c.quadraticCurveTo(-gb / 2, -lung * 0.42, -gros / 2, -lung + gros / 2);
  c.arc(0, -lung + gros / 2, gros / 2, Math.PI, 0);
  c.quadraticCurveTo(gb / 2, -lung * 0.42, gb / 2, 0);
  /* Baza se rotunjește ca un bulb. Dacă am lăsa-o dreaptă — cum o închide
     umplerea de la sine — și dacă degetul ar ieși cât de puțin din palmă, s-ar
     vedea exact acolo o muchie dreaptă, lungă, ca o tăietură de foarfece. */
  c.quadraticCurveTo(0, gb * 0.44, -gb / 2, 0);
  c.restore();
}

// Strânge o bucată spre mijlocul ei cu `e` pixeli pe fiecare margine.
function subtiat(c, cx, cy, lat, inalt, e, contur) {
  c.save();
  c.translate(cx, cy);
  c.scale(Math.max(0.02, 1 - e / lat), Math.max(0.02, 1 - e / inalt));
  c.translate(-cx, -cy);
  contur();
  c.restore();
}

/* Palma: lată sus, la încheieturile degetelor, îngustată spre încheietura
   mâinii, cu movulița degetului mare bombată în stânga.

   Capătul de sus e bombat, nu retezat. Dacă palma s-ar termina cu un colț, iar
   colțul ar ieși în afara degetului dinspre margine, între ele ar rămâne un
   prag — și pragul acela se citește ca o întrerupere în balon. Bombat, capătul
   coboară în aceeași direcție în care urcă flancul degetului, iar cele două se
   întâlnesc lin. */
function palmaManusii(c, s, e) {
  subtiat(c, -s * 0.02, s * 0.14, s * 0.68, s * 0.50, e || 0, function () {
    c.moveTo(-s * 0.66, -s * 0.06);
    c.bezierCurveTo(-s * 0.72, -s * 0.26, -s * 0.42, -s * 0.46, -s * 0.02, -s * 0.44);
    c.bezierCurveTo(s * 0.32, -s * 0.42, s * 0.62, -s * 0.28, s * 0.64, -s * 0.02);
    c.bezierCurveTo(s * 0.66, s * 0.18, s * 0.50, s * 0.34, s * 0.35, s * 0.50);
    c.quadraticCurveTo(0, s * 0.58, -s * 0.33, s * 0.50);
    c.bezierCurveTo(-s * 0.54, s * 0.34, -s * 0.72, s * 0.16, -s * 0.66, -s * 0.06);
    c.closePath();
  });
}

/* Manșeta: strânsă pe încheietură și larg evazată la poale. Colțurile ei de sus
   stau bine îngropate în palmă, nu la marginea ei: dacă ar ieși de sub palmă,
   la încheietură ar rămâne același prag ca între degete. */
function mansetaManusii(c, s, e) {
  subtiat(c, s * 0.01, s * 0.84, s * 0.71, s * 0.42, e || 0, function () {
    c.moveTo(-s * 0.34, s * 0.34);
    c.lineTo(s * 0.36, s * 0.34);
    c.bezierCurveTo(s * 0.50, s * 0.70, s * 0.66, s * 0.90, s * 0.71, s * 1.06);
    c.quadraticCurveTo(s * 0.74, s * 1.18, s * 0.60, s * 1.20);
    c.quadraticCurveTo(0, s * 1.32, -s * 0.60, s * 1.20);
    c.quadraticCurveTo(-s * 0.74, s * 1.18, -s * 0.71, s * 1.06);
    c.bezierCurveTo(-s * 0.66, s * 0.90, -s * 0.48, s * 0.70, -s * 0.34, s * 0.34);
    c.closePath();
  });
}

/* Nodul de sub poale — semnul după care ochiul recunoaște un balon dintr-o
   privire. Face parte din același contur, deci din aceeași bucată. */
function nodulManusii(c, s, e) {
  subtiat(c, 0, s * 1.26, s * 0.13, s * 0.11, e || 0, function () {
    /* Trasat în același sens ca celelalte bucăți — pe acolo, pe unde merg acele
       ceasornicului. Întors invers, regula „nonzero" l-ar socoti gaură, și
       exact acolo unde se suprapune peste poalele manșetei s-ar căsca o
       fereastră neagră. */
    c.moveTo(s * 0.12, s * 1.16);
    c.quadraticCurveTo(s * 0.10, s * 1.36, 0, s * 1.37);
    c.quadraticCurveTo(-s * 0.10, s * 1.36, -s * 0.12, s * 1.16);
    c.closePath();
  });
}

/* Gulerul încheieturii. Palma coboară strângându-se, manșeta urcă evazându-se,
   iar acolo unde se încrucișează rămâne un unghi intrând — și orice unghi
   intrând se citește ca o tăietură. Bomba asta turtită acoperă încrucișarea din
   amândouă părțile: fiind rotundă peste tot, nu poate naște niciun colț. */
function gulerManusii(c, s, e) {
  const inset = e || 0;
  const rx = s * 0.42 - inset, ry = s * 0.17 - inset;
  if (rx <= 0 || ry <= 0) return;
  c.moveTo(rx, s * 0.46);
  c.ellipse(0, s * 0.46, rx, ry, 0, 0, Math.PI * 2);
}

/* Cele cinci degete. Nu spițe de roată: patru cresc aproape drept în sus din
   marginea palmei, abia răsfirate, iar degetul mare iese lateral, mai jos și
   mai gros. Baza fiecăruia stă adânc în palmă, ca să nu rămână crăpătură.
   Fiecare are ritmul, amplitudinea și viteza lui — dacă toate ar bate la fel,
   mâna ar arăta a metronom. */
const DEGETE_MANUSA = [
  { x: -0.29, y:  0.19, lung: 0.88, gros: 0.29, unghi: -1.16, ritm: 0.0, amp: 0.07, viteza: 0.0031, baza: 0.46 },
  { x: -0.38, y:  0.04, lung: 0.94, gros: 0.29, unghi: -0.17, ritm: 1.6, amp: 0.10, viteza: 0.0044, baza: 0.40 },
  { x: -0.12, y:  0.00, lung: 1.04, gros: 0.30, unghi: -0.04, ritm: 3.1, amp: 0.09, viteza: 0.0039, baza: 0.40 },
  { x:  0.14, y:  0.02, lung: 0.98, gros: 0.29, unghi:  0.10, ritm: 4.4, amp: 0.11, viteza: 0.0047, baza: 0.39 },
  { x:  0.38, y:  0.10, lung: 0.76, gros: 0.25, unghi:  0.30, ritm: 5.9, amp: 0.15, viteza: 0.0053, baza: 0.35 }
];

// Cât se leagănă un deget în clipa t — două unde care nu se împart una la alta.
function leganDeget(d, t) {
  return Math.sin(t * d.viteza + d.ritm) * d.amp
       + Math.sin(t * d.viteza * 1.73 + d.ritm * 2.1) * d.amp * 0.34;
}

// Tot balonul, într-un singur contur, subțiat cu `e` pixeli de jur împrejur.
function siluetaManutei(c, s, t, e) {
  const inset = e || 0;
  c.beginPath();
  for (const d of DEGETE_MANUSA) {
    const gros = s * d.gros - inset * 2, lung = s * d.lung - inset;
    const baza = s * (d.baza || d.gros) - inset * 2;
    if (gros > s * 0.02 && lung > gros) {
      degetManusa(c, s * d.x, s * d.y, lung, gros, d.unghi + leganDeget(d, t), baza);
    }
  }
  palmaManusii(c, s, inset);
  gulerManusii(c, s, inset);
  mansetaManusii(c, s, inset);
  /* Nodul e mic cât o măslină. Scobit ca palma, ar rămâne din el o pată neagră,
     așa că la scobituri îl sărim cu totul: el rămâne plin. */
  if (inset <= 0) nodulManusii(c, s, inset);
}

/* Scobitura dinăuntru. La un balon adevărat, marginea e locul unde privirea
   trece prin cea mai multă foiță, deci acolo e cel mai aprins; prin mijloc se
   vede aproape numai ce e în spate.

   O scobim din două umpluturi estompate, nu din trepte: oricâte trepte am pune,
   fiecare își lasă muchia ei, și balonul ajunge să arate ca o hartă cu curbe de
   nivel. Cea dintâi, mărunțică, stinge miezul degetelor; a doua, adâncă, golește
   palma și manșeta, care sunt late. */
const SCOBITURI_BALON = [
  { adanc: 0.075, ceata: 0.050, umbra: 0.34 },
  { adanc: 0.265, ceata: 0.100, umbra: 0.60 }
];

// Un aleator cu sămânță: cioburile zboară la fel de fiecare dată.
function samantaBalon(i) {
  const v = Math.sin(i * 53.7 + 7.3) * 39217.7;
  return v - Math.floor(v);
}

/* Ce rămâne dintr-un balon spart: câteva fâșii de foiță care zboară în lături,
   răsucindu-se și căzând puțin. Se sting repede — un balon spart nu lasă nimic
   în urmă, ăsta e tot rostul lui. */
function cioburileBalonului(x, y, s, p) {
  const q = Math.min(1, Math.max(0, p));
  const stins = 1 - q;
  if (stins <= 0) return;
  ctx.save();
  ctx.translate(x, y);
  for (let k = 0; k < 11; k++) {
    const a = (k / 11) * Math.PI * 2 + samantaBalon(k) * 0.5;
    /* Pornesc de pe marginea balonului, nu din mijlocul lui: foița se rupe pe
       unde era întinsă, iar cioburile adunate în centru arată a pată, nu a
       spargere. */
    const departe = s * (0.45 + samantaBalon(k + 20) * 0.5 + q * 1.35);
    ctx.save();
    ctx.translate(Math.cos(a) * departe,
                  Math.sin(a) * departe * 0.9 + q * q * s * 0.5);
    ctx.rotate(a + q * (3 + samantaBalon(k + 40) * 5));
    ctx.globalAlpha = Math.min(1, stins * 1.35) * 0.95;
    ctx.fillStyle = k % 3 === 0 ? 'rgba(255, 255, 255, 0.9)' : 'rgba(224, 238, 255, 0.75)';
    const lung = s * (0.14 + samantaBalon(k + 60) * 0.2) * (0.5 + stins * 0.5);
    ctx.beginPath();
    ctx.moveTo(-lung, 0);
    ctx.quadraticCurveTo(0, -lung * 0.42, lung, 0);
    ctx.quadraticCurveTo(0, lung * 0.16, -lung, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function manutaAlba(x, y, s, t) {
  /* Cât de stins e tot desenul, hotărât de cine ne cheamă — la pocnet, balonul
     se stinge. Îl ținem minte și înmulțim cu el orice opacitate pusă înăuntru:
     o sclipire care își scrie singur `globalAlpha` iese peste stingere și
     rămâne pe ecran ca un oval alb, după ce tot restul a dispărut. */
  const stinsul = ctx.globalAlpha;
  ctx.save();
  // încheietura descrie un opt alene, nu o simplă rotire dus-întors
  ctx.translate(x + Math.sin(t * 0.0009) * s * 0.05,
                y + Math.sin(t * 0.0018 + 1.2) * s * 0.03);
  ctx.rotate(Math.sin(t * 0.0013) * 0.045 + Math.sin(t * 0.0007) * 0.03);
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';

  // ața, atârnând din nod în jos, spre afara ecranului
  const ata = ctx.createLinearGradient(0, s * 1.3, 0, s * 3.2);
  ata.addColorStop(0, 'rgba(226, 238, 255, 0.75)');
  ata.addColorStop(1, 'rgba(226, 238, 255, 0)');
  ctx.strokeStyle = ata;
  ctx.lineWidth = Math.max(1, s * 0.018);
  ctx.beginPath();
  ctx.moveTo(0, s * 1.34);
  ctx.bezierCurveTo(s * 0.14, s * 1.9, -s * 0.16, s * 2.5, s * 0.06, s * 3.2);
  ctx.stroke();

  /* Foița: o singură umplere, cu lumina venind din stânga-sus. Tot balonul e
     translucid — pe fundalul negru se vede că prin el trece noaptea. */
  ctx.shadowColor = 'rgba(168, 208, 255, 0.5)';
  ctx.shadowBlur = s * 0.4;
  /* Un contur umflat cu o idee, dedesubt: marginea care iese de sub foiță e
     linia aprinsă a balonului. N-o putem trage cu creionul, fiindcă un creion
     ar contura și bucățile îngropate una într-alta — dar o formă puțin mai
     mare, așezată dedesubt, lasă exact aceeași dungă, și numai pe afară. */
  ctx.fillStyle = 'rgba(233, 245, 255, 0.62)';
  siluetaManutei(ctx, s, t, -s * 0.022);
  ctx.fill();
  ctx.shadowBlur = 0;

  const foita = ctx.createLinearGradient(-s * 0.7, -s * 1.15, s * 0.85, s * 1.3);
  foita.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
  foita.addColorStop(0.38, 'rgba(226, 240, 255, 0.66)');
  foita.addColorStop(0.72, 'rgba(196, 214, 238, 0.56)');
  foita.addColorStop(1, 'rgba(158, 180, 210, 0.5)');
  ctx.fillStyle = foita;
  siluetaManutei(ctx, s, t, 0);
  ctx.fill();

  /* Scobim miezul cu noaptea din spate, treaptă cu treaptă. Fiecare treaptă e
     tot o singură umplere a reuniunii, deci nu apar cusături între bucăți. */
  for (const sc of SCOBITURI_BALON) {
    ctx.filter = `blur(${Math.max(1, s * sc.ceata)}px)`;
    ctx.fillStyle = `rgba(0, 0, 0, ${sc.umbra})`;
    siluetaManutei(ctx, s, t, s * sc.adanc);
    ctx.fill();
  }
  ctx.filter = 'none';

  // de-acum înainte pictăm numai înăuntrul balonului
  ctx.save();
  siluetaManutei(ctx, s, t, 0);
  ctx.clip();

  /* Curcubeul subțire al foiței de săpun: trei pete moi, fiecare de altă
     culoare, care se plimbă alene. Ele fac diferența dintre plastic și balon. */
  const irizatii = [
    { x: -0.34, y: -0.30, r: 0.62, c: '255, 214, 150', a: 0.17, faza: 0.0 },
    { x:  0.32, y:  0.30, r: 0.70, c: '150, 220, 255', a: 0.15, faza: 2.1 },
    { x: -0.10, y:  0.86, r: 0.55, c: '255, 168, 210', a: 0.13, faza: 4.2 }
  ];
  for (const p of irizatii) {
    const px = s * p.x + Math.sin(t * 0.00042 + p.faza) * s * 0.16;
    const py = s * p.y + Math.sin(t * 0.00035 + p.faza * 1.4) * s * 0.13;
    const pata = ctx.createRadialGradient(px, py, 0, px, py, s * p.r);
    pata.addColorStop(0, `rgba(${p.c}, ${p.a})`);
    pata.addColorStop(1, `rgba(${p.c}, 0)`);
    ctx.fillStyle = pata;
    ctx.fillRect(-s * 1.3, -s * 1.4, s * 2.7, s * 3.0);
  }

  /* Sclipirile: una lungă pe degetul din mijloc, una rotundă pe movulița
     degetului mare, una lățită pe manșetă. Ele sunt singurul loc unde albul e
     plin — restul foiței e străveziu. */
  ctx.save();
  ctx.rotate(leganDeget(DEGETE_MANUSA[2], t) * 0.6);
  const aura = ctx.createRadialGradient(-s * 0.21, -s * 0.66, 0, -s * 0.21, -s * 0.66, s * 0.2);
  aura.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
  aura.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = aura;
  ctx.fillRect(-s * 0.5, -s * 1.0, s * 0.6, s * 0.7);
  ctx.fillStyle = ALB_MANUSA;
  ctx.globalAlpha = 0.82 * stinsul;
  ctx.beginPath();
  ctx.ellipse(-s * 0.21, -s * 0.66, s * 0.028, s * 0.2, 0.02, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
  ctx.beginPath();
  ctx.ellipse(-s * 0.36, s * 0.0, s * 0.14, s * 0.1, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.34)';
  ctx.beginPath();
  ctx.ellipse(-s * 0.30, s * 1.0, s * 0.2, s * 0.055, 0.09, 0, Math.PI * 2);
  ctx.fill();
  // lumina care se întoarce de jos, rece, pe muchia dinspre degetul mic
  const rasfrant = ctx.createLinearGradient(-s * 0.2, s * 1.05, s * 0.8, -s * 0.15);
  rasfrant.addColorStop(0, 'rgba(190, 222, 255, 0)');
  rasfrant.addColorStop(0.5, 'rgba(190, 222, 255, 0.26)');
  rasfrant.addColorStop(1, 'rgba(190, 222, 255, 0)');
  ctx.fillStyle = rasfrant;
  ctx.fillRect(-s * 1.3, -s * 1.4, s * 2.7, s * 3.0);

  ctx.restore();
  ctx.restore();
}
