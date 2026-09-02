/* ---------- 7. ATINGERILE UTILIZATORULUI ---------- */
/* Nașterea punctului. Nu mai stă în ascultătorul de atingeri, fiindcă n-o mai
   pornește atingerea: o pornește bucla, în clipa în care s-au risipit cioburile
   balonului spart. */
function incepeJucaria(acum) {
  stare = 'crestere';
  inceputulCresterii = acum;
  balon.x = W / 2;
  balon.y = H / 2;
  balon.razaBaza = Math.min(W, H) * 0.11;
  initMembrana();
  alegeTintaNoua(acum);
  sunetRasarit();
}

window.addEventListener('pointerdown', (e) => {
  cursor.x = e.clientX * scalaPanzei;
  cursor.y = e.clientY * scalaPanzei;
  cursor.ultimaMiscare = performance.now();
  pornesteAudio();
  sunetAtingere();          // ciocănitul discret care însoțește orice atingere
  const acum = performance.now();

  /* — Deschiderea: atingerea întoarce foaia, până la ultima — */
  if (stare === 'intuneric' && intoarcePagina(acum)) {
    if (audio) sunetHartie();
    return;
  }

  /* Pe ultima foaie, atingerea sparge balonul-mânuță, și atât. Jocul pornește
     abia când s-au risipit cioburile, iar de asta se ocupă bucla, nu atingerea:
     pocnetul are nevoie de o răsuflare ca să se vadă și să se audă, altfel
     atingerea ta și nașterea punctului se calcă una pe alta. */
  if (stare === 'intuneric') { spargeBalonulManutei(acum); return; }

  /* — Scena 1→2: gâdilatul și prinderea balonului — */
  if (stare === 'balon') {
    const distanta = Math.hypot(balon.x - cursor.x, balon.y - cursor.y);

    // după ce a scăpat de câteva ori, balonul obosit poate fi prins cu un click precis
    if (numarEvadari >= EVADARI_PANA_SE_PREDA && distanta < razaDePrindere()) {
      stare = 'transformare';
      inceputulTransformarii = acum;
      minge.x = balon.x;
      minge.y = balon.y;
      minge.raza = balon.razaBaza * 0.85;
      minge.razaStart = minge.raza;
      // mingea nu rămâne cât balonul: crește în timpul căderii, ca privirea să
      // se ducă la ea, nu la elefantul care tocmai se ivește în depărtare
      minge.razaTinta = Math.min(W, H) * 0.155;
      minge.sol = H * 0.78;
      /* Intră din dreapta și vine spre stânga. E partea liberă a ecranului —
         în stânga jos stă scrisă definiția petei de culoare. */
      elefant.x = W * 0.88;
      elefant.scara = 0.62;
      elefant.directie = -1;
      sunetTransformare();
      return;
    }

    if (distanta < balon.razaBaza * 1.8) {
      let dirX, dirY;
      if (distanta < 1) {
        // atingere fix în centru: fuge într-o direcție aleatorie
        const unghi = Math.random() * Math.PI * 2;
        dirX = Math.cos(unghi);
        dirY = Math.sin(unghi);
      } else {
        dirX = (balon.x - cursor.x) / distanta;
        dirY = (balon.y - cursor.y) / distanta;
      }
      balon.vx += dirX * 9;                  // țâșnește departe de deget
      balon.vy += dirY * 9;
      // pielea balonului tresare din locul atins — undă de gelatină
      impulsMembrana(Math.atan2(-dirY, -dirX), balon.razaBaza * 0.18);
      numarEvadari++;
      if (acum - balon.ultimulChicotit > 600) {
        balon.ultimulChicotit = acum;
        sunetChicotit();
      }
    }
    return;
  }

  /* — Scena 1→2: degetul ajunge înaintea mingii —
     Cine vede mingea ivindu-se vrea s-o atingă pe loc. Dacă atingerea n-ar face
     nimic până la capătul metamorfozei, jucăria ar părea că nu ascultă. Așa că
     atingerea grăbește metamorfoza, iar mingea se îndeasă chiar acum și sare
     imediat ce s-a făcut. */
  if (stare === 'transformare') {
    if (Math.hypot(minge.x - cursor.x, minge.y - cursor.y) < minge.raza * 2) {
      minge.turtire = 1;
      minge.luminozitate = 1;
      minge.atinsaInCrestere = true;
      inceputulTransformarii = Math.min(inceputulTransformarii,
                                        acum - DURATA_TRANSFORMARII + 220);
      sunetBucurie();
    }
    return;
  }

  /* — Scena 2: joaca cu mingea și elefantul — */
  if (stare === 'minge') {
    /* Întâi baloanele de pe cer: ele plutesc departe de minge și de elefant,
       așa că n-au cum să fure o atingere de la ei. */
    const balon = balonulDeSub(cursor.x, cursor.y);
    if (balon) { spargeBalonul(balon); return; }

    // atingerea mingii (doar când e liberă)
    if (minge.mod === 'liber' && !minge.inBuzunar) {
      const distanta = Math.hypot(minge.x - cursor.x, minge.y - cursor.y);
      if (distanta < minge.raza * 1.5) {
        if (cursor.viteza > 1.0) {
          // apăsare agresivă → se sperie și fuge după elefant
          minge.mod = 'fuge';
          minge.sareDeBucurie = false;
          minge.sarituriRamase = 0;
          minge.turtire = 1;
          sunetSperiat();
        } else {
          // atingere delicată → strălucește și sare de bucurie, împrăștiind culori
          minge.luminozitate = 1;
          minge.sareDeBucurie = true;
          minge.sarituriRamase = 3;
          minge.vy = saltulMingii(0.3);
          minge.turtire = 1;          // răspunsul se vede chiar în cadrul atingerii
          sunetBucurie();
        }
        minge.ultimaProvocare = acum;
        return;
      }
    }
    // atingerea elefantului
    const u = unitateElefant(elefant.scara);
    const py = picioareElefant();
    if (Math.abs(cursor.x - elefant.x) < 90 * u && cursor.y > py - 150 * u && cursor.y < py) {
      // după ce a strâns mingea și s-a liniștit, atingerea lui deschide Scena 3
      if (minge.inBuzunar && elefant.stare === 'plimbare') { intrareScena3(acum); return; }
      sunetTrompeta();   // altfel, doar o mică trompeță
    }
    return;
  }

  /* — Scena 3: muzeul secret — */
  if (stare === 'muzeu') { click3(acum); return; }

  /* — Scena 4: galeria cu miniatura — */
  if (stare === 'galerie') { click4(acum); return; }

  /* — Scena 5: cei zece pași înapoi — */
  if (stare === 'campie') { click5(acum); return; }
  if (stare === 'foc') { click6(acum); return; }
  if (stare === 'gheata') { click7(acum); return; }
  if (stare === 'ulei') { click8(acum); return; }
});
