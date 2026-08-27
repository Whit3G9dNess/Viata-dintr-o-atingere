# Plan de implementare — Viața dintr-o atingere

Planul de lucru pentru jucăria descrisă în [SPEC.md](SPEC.md).

Etapele din SPEC §9 sunt ordonate *după poveste*: scena 1, scena 2, scena 3, și
așa mai departe, cu deschiderea la urmă fiindcă a fost gândită ultima. Planul de
mai jos le ține în aceeași ordine, dar cu o deosebire: **fiecare scenă e întreagă
și jucabilă înainte să înceapă următoarea.** Nu s-a desenat niciodată un decor
pentru o scenă care nu se putea juca. De-aia jucăria a fost bună de arătat de la
Faza 2 încolo, oricând, chiar dacă se termina brusc.

Fazele de la 10 în sus n-au adus scene noi. Au dres ce nu mergea — și lista lor e
partea cea mai folositoare din fișierul ăsta, fiindcă acolo scrie ce s-a stricat
și de ce.

## Stadiu

| Fază | Ce conține | Stare |
|------|------------|-------|
| 0 | Scheletul: pânză, buclă, cursor, sunete | ✅ gata |
| 1 | Scena 1 — punctul și balonul de săpun | ✅ gata |
| 2 | Scena 2 — mingea, petele, elefantul | ✅ gata |
| 3 | Peisajul care crește: plante și nori | ✅ gata |
| 4 | Scena 3 — muzeul din haina elefantului | ✅ gata |
| 5 | Manualul, diploma, „NU MĂ APĂSA!" | ✅ gata |
| 6 | Scena 4 — galeria cu miniatura și lupa | ✅ gata |
| 7 | Rama aurită adevărată, sculptată din brâuri | ✅ gata |
| 8 | Scena 5 — pânza uriașă și cei zece pași înapoi | ✅ gata |
| 9 | Deschiderea: trei foi și mânuța | ✅ gata |
| 10 | Lag: scena nu se mișca | ✅ gata |
| 11 | Mingea nu mai sare singură, și răspunde pe loc | ✅ gata |
| 12 | Mânuța devine balon dintr-o bucată | ✅ gata |
| 13 | Nimeni nu rămâne blocat în galerie | ✅ gata |
| 14 | Baloanele se fac nori numai când le atingi | ✅ gata |
| 15 | Sala a cincea: ramă, pantofi, port românesc | ✅ gata |
| 16 | Țăranii calcă, sala respiră, rama vine mai târziu | ✅ gata |

---

## Faza 0 — Scheletul

- Pânză pe tot ecranul, redimensionare cu `devicePixelRatio`, cu **plafon de
  rezoluție**. Buclă `requestAnimationFrame` cu `dt`.
- Cursor propriu, luminos: cel de sistem se ascunde. Se ține minte și viteza
  degetului — de ea depinde dacă mingea se bucură sau se sperie.
- Unelte mărunte de desen: interpolare, ușurare, dreptunghi rotunjit, capsulă.
- Sunetele, toate sintetizate: notă, zgomot filtrat, acord.

**Verificare:** pagina se deschide, pânza se redimensionează, cursorul lasă dâră.

## Faza 1 — Punctul și balonul de săpun

- Un punct alb pe negru, care crește. Fundalul se deschide din negru spre gri pe
  măsură ce crește.
- Balonul: membrană cu iridescență, luciu și deformare lentă. Se plimbă singur
  spre ținte alese la întâmplare.
- La atingere, se transformă.

**Verificare:** atingi ecranul, se naște punctul, crește balon, îl atingi și se
schimbă.

## Faza 2 — Mingea, petele, elefantul

- Mingea, cu gravitație, turtire la impact și fluierat de desen animat.
- **Atingerea delicată** → strălucire și sărituri de bucurie care împrăștie
  culori. **Apăsarea agresivă** → se sperie și fuge. Diferența o face viteza
  degetului, ținută minte de la Faza 0.
- Fiecare săritură lasă o pată de culoare. La cincisprezece pete, vine elefantul.
- Elefantul: unitate de măsură `u`, tot corpul desenat în multipli de ea, ca să
  se poată mări și micșora dintr-o singură scară. Trompa e un furtun viu, care
  urmărește pata la rând.

**Verificare:** mingea sare, lasă pete, elefantul vine și le soarbe pe toate.

## Faza 3 — Peisajul care crește din culorile sorbite

Curățenia era un timp mort: stăteai și te uitai cum dispar petele. Faza asta face
din ea momentul în care lumea se umple.

- Fiecare culoare sorbită iese pe creștetul elefantului ca un **balon colorat**.
- Una urcă și se face nor, următoarea coboară și se face plantă — pe rând, ca
  peisajul să crească deopotrivă sus și jos.
- **Grădina nu se șterge niciodată.** Plantele rămân, și în scena a treia muzeul
  stă în mijlocul lor.
- Plantele se **ștampilează**: fiecare soi și culoare se pictează o dată pe o
  pânză ascunsă, pe urmă se apasă ca o ștampilă, înclinată puțin ca să se legene.
  Cincizeci de plante × douăzeci de linii × șaizeci de cadre pe secundă era o
  socoteală pe care n-o duce nimeni.

**Verificare:** la capătul curățeniei, cerul are nori colorați și pământul are o
grădină — și amândouă rămân.

## Faza 4 — Muzeul e chiar elefantul

Prima încercare a fost o clădire-muzeu, cu uși și ferestre. Greșit: **muzeul e
elefantul**. Se așază cu fața la tine și își deschide haina.

- Ochii lui sunt ferestrele, haina e ușa, **buzunarele hainei sunt cele nouă
  galerii**, numerotate.
- Soneria e **cercelul din urechea lui**: se întinde ca un elastic spre degetul
  care trage de el și strălucește ca un rubin.
- Butoanele stau pe laturi, **niciodată pe fața lui**.
- În spate, peisajul cu grădina făcută în Faza 3, ștampilat o dată.

**Verificare:** elefantul se așază, deschide haina, iar o atingere pe un buzunar
te duce înăuntru.

## Faza 5 — Manualul, diploma, „NU MĂ APĂSA!"

- **Plicul și scrisoarea** care te cheamă înăuntru.
- **Manualul** cu 369 de articole, scos din buzunar și deschis spre tine ca o
  carte veche. Îl răsfoiești atingându-l. Textul e adevărat, despre conduita ta
  în atelierele-galerii, nu umplutură. Ultimul articol, 318: *Semnează că ai luat
  la cunoștință prin apăsarea cercelului. Toate drepturile de autor sunt rezervate
  vizitatorului creator.*
- **„NU MĂ APĂSA!"** — cercelul te roagă să nu-l apeși. Îl apeși oricum. La
  cincizeci de apăsări, se predă. Pe drum, bilețele care comentează.
- **Diploma** vine din trompă sau din labă. Nu apare singură pe ecran: cineva
  ți-o dă.
- Pe sonerie nu scrie „da" sau „nu". Se înțelege.

**Verificare:** parcurgi tot drumul, de la plic până la haina deschisă, numai din
atingeri.

## Faza 6 — Galeria cu miniatura și lupa

- Interior **rococo realist**: lambriuri, oglinzi, candelabru, parchet în spic,
  frânghie de catifea. Sala se pictează o dată pe o pânză ascunsă.
- În mijloc, o **miniatură neagră**, mică de tot.
- Pe o consolă de marmură, o **lupă**. Se ia **prin intenție**: o atingi ca s-o
  iei în mână. Nu vine singură — asta era cererea, și e și mai bine așa, fiindcă
  primul lucru pe care îl faci în sală e o alegere.
- Ținută peste miniatură → descoperi ce e în ea. Peste tăblița ramei → eticheta.
  Atingi rama → poartă spre scena a cincea.
- **Nu scrie nicăieri că rama s-a făcut ușă.** Se vede.

**Verificare:** iei lupa, găsești taina, găsești eticheta, treci prin ramă.

## Faza 7 — Rama aurită adevărată

Prima ramă era un chenar cu gradient. Arăta a desen, nu a sculptură.

O ramă aurită adevărată e un **teanc de brâuri concentrice**, fiecare cu
ornamentul lui: mărgele, tor gadronat (lobii înclinați, cu creastă luminată și
vale întunecată), iar mărgele, dinți, o friză netedă, frunzulițe. În colțuri,
brâurile se rup și în locul lor stă câte un cartuș de acant. În creștet, o scoică.

- **Tot aurul iese dintr-o singură scară de lumină**: 0 e fundul negru al unei
  scobituri, 1 e creasta lustruită. Așa ornamentele nu mai sunt pete de culoare
  puse una lângă alta, ci același metal văzut sub lumini diferite. Ăsta e lucrul
  care face diferența dintre desen și sculptură.
- **Bolul roșu** de dedesubt se ivește pe unde s-a tocit aurul. O ramă veche nu e
  niciodată de o singură culoare.
- **Patina**: praful se strânge în scobituri, iar jumătatea de jos-dreapta stă în
  umbră. O trecere peste tot, la sfârșit, leagă ornamentele mai bine decât orice
  detaliu în plus.
- Rama se pictează **o dată** și se ștampilează. Sculptată la fiecare cadru, ar
  costa cât toată scena.
- Profilul e **parametric**: cât din lățime ține aurul. În jurul unei miniaturi e
  lat, ca să i se vadă sculptura; în jurul unei pânze mari, aceeași proporție ar
  da un profil cât un stat de om.

**Verificare:** rama se vede sculptată, nu desenată, și scena nu încetinește.

## Faza 8 — Pânza uriașă și cei zece pași înapoi

- Intri și nu vezi decât **pixeli**, pe tot ecranul. Se retrag încet, ca o ceață
  care se ridică de pe un lucru pe care încă nu-l poți numi.
- Rămâne o sală cu o **pânză uriașă**, tot pixelată, și o poruncă: fă zece pași în
  spate.
- Cu fiecare atingere te depărtezi un pas: pânza se micșorează și se limpezește.
  Claritatea urmează pașii **cu o mică lene**, ca depărtarea să se simtă.
- La al zecelea pas, **țăranii prind viață**, îți fac cu mâna și te strigă. Pe
  urmă se duc la hambar și-i deschid ușile.
- Pictura e impresionistă: câmpuri de tușe scurte, pe direcții, cu paletă caldă
  lângă rece. Un **aleator cu sămânță** ține tușele pe loc de la o repictare la
  alta — altfel toată pânza ar fierbe.

**Verificare:** faci zece pași, tabloul se limpezește, oamenii din el te strigă.

## Faza 9 — Deschiderea: trei foi și mânuța

Jucăria începea direct cu punctul pe negru. Nimeni nu știa ce are în față.

- **Foaia întâi:** titlul, de tipar, între două linii.
- **Foaia a doua:** ce fel de lucru e — *o jucărie digitală nu are scop și nu are
  sfârșit*.
- **Foaia a treia:** mânuța albă care dă din degete, cu îndemnul deasupra.
- Foile se întorc și singure, după un răgaz, dar **atingerea întoarce foaia, nu
  pornește jocul**. Altfel cine atinge din prima curiozitate n-ar vedea niciodată
  foile a doua și a treia — și exact asta s-a și întâmplat la prima încercare.
  Jocul pornește abia de pe ultima foaie.
- Mânuța stă **sub** rândul scris, niciodată peste el.

**Verificare:** trei atingeri, trei foi, în ordine; a patra pornește punctul.

## Faza 10 — Lag: scena nu se mișca

Scena a treia abia se târa. Prima măsurătoare a dat 0,88 ms pe cadru și am zis că
e reparat — nu era. **Socoteala greșită**: numărasem formele, dar scena nu era
grea la forme, era grea la **pixeli**. Un ecran mare, umplut de câteva ori pe
cadru cu gradiente, costă cât o mie de forme mici.

- **Plafon de rezoluție** pe pânză: peste o anumită mărime nu se mai desenează
  mai fin, fiindcă oricum nu se vede.
- **Regulator de calitate**: dacă un cadru a durat prea mult, scade singur
  fineţea, și o urcă la loc când respiră.
- **Ștampile** peste tot: peisajul, sala, rama, plantele, norii. Portalul din
  galerie sărise la 1308 forme pe cadru și 6,83 ms; ștampilat, 0,42 ms.
- Testele au acum **plafoane de operații de desen**, ca să nu se mai poată
  strecura o scenă grea fără să se vadă.

**Verificare:** un cadru din scena a treia stă sub o milisecundă, măsurat de test.

## Faza 11 — Mingea nu mai sare singură, și răspunde pe loc

Două plângeri, una după alta, și amândouă adevărate.

- **„Sare și singură, ceea ce nu doresc."** Acum stă și fluieră după tine. Sare
  numai dacă o atingi.
- **„Dau clic pe ea și nu sare imediat."** Măsurat, mingea reacționa chiar în
  cadrul atingerii — dar se mișca 12% dintr-o rază. Săritura era scrisă în pixeli
  ficși, iar mingea se mărise: aceeași săritură arăta uriașă la o minge mică și
  neînsemnată la una mare. Acum **totul se socotește din rază**, iar turtirea se
  vede în chiar cadrul atingerii.

**Verificare:** mingea nu sare niciodată singură, iar la atingere se turtește pe
loc.

## Faza 12 — Mânuța devine balon dintr-o bucată

Mânuța era desenată din petice conturate cu tuș: degete, palmă, manșetă, fiecare
cu linia lui. Arăta a greblă, iar la cusături se vedeau tăieturi.

- **Un singur contur.** Toate bucățile intră într-o singură cale, umplută o dată
  cu regula *nonzero*: reuniunea se umple exact o dată, deci suprapunerile nu se
  văd și transparența nu se dublează. Fiecare bucată e trasată în același sens —
  întoarsă invers, regula o socotește gaură (nodul chiar a fost, o vreme, o
  fereastră neagră în poalele manșetei).
- **Străvezie ca balonul de săpun.** Marginea e aprinsă, mijlocul lasă noaptea să
  treacă. Scobit din **două umpluturi estompate**, nu din trepte: oricâte trepte
  am pus, fiecare își lăsa muchia, și balonul ajungea o hartă cu curbe de nivel.
- **Fără rupturi.** Capătul palmei e bombat, ca degetele de la margini să se
  întâlnească lin cu el; degetele au baza lățită și rotunjită, ca să intre în
  palmă ca o rădăcină; un guler turtit acoperă încrucișarea dintre palmă și
  manșetă. Orice unghi intrând se citește ca o tăietură.

**Verificare:** cinci degete care se mișcă, niciun contur întrerupt, nicio pată
neagră.

## Faza 13 — Nimeni nu rămâne blocat în galerie

Întrebarea care a pornit faza: *„ajung la primul tablou și nu știu ce să fac."*
Asta nu e o întrebare, e un bug.

- **Lupa cheamă** de pe consolă dacă nu se întâmplă nimic patru secunde.
- **Îndemnul spune unde e**, nu doar că există: *„Lupa e pe consola din dreapta
  tabloului."*
- **Fiecare ratare ajută**: locul de unde se lasă apucată se lărgește cu fiecare
  atingere care n-a nimerit-o, iar după șase încercări îți sare singură în mână.
- **Cu lupa în mână** se poate rătăci la fel de bine: dacă umbli fără s-o duci pe
  miniatură, miniatura se aprinde.
- **Un inel se umple** în jurul lupei cât o ții pe locul bun, iar textul zice
  *„Așa. Ține-o pe loc."* Înainte scria mai departe „caută", tocmai când
  găsiseși — mișcarea ta și vorba de pe ecran vorbeau despre lucruri diferite.
- Consola s-a ridicat la înălțimea tabloului. Un obiect așezat la genunchi se ia
  din aplecare, și se simte greu de apucat.

**Verificare:** un jucător care nu nimerește nimic ajunge totuși în sala
următoare.

## Faza 14 — Baloanele se fac nori numai când le atingi

Norii se făceau singuri, la capătul unui drum socotit de ceas. Cerul se umplea
cât te uitai.

- Baloanele care urcă își iau un loc pe cer și **plutesc acolo, legănându-se**,
  cu o ațișoară, până le atingi tu.
- **Plantele răsar în continuare singure.** Numai norii au nevoie de mâna ta —
  altfel curățenia ar deveni o corvoadă.
- Cine nu le atinge nu rămâne cu cerul acoperit: peste douăsprezece, cel mai
  bătrân pleacă în sus, ca unul scăpat din mână.

**Verificare:** un balon lăsat treizeci de secunde e tot acolo; atins, se face nor.

## Faza 15 — Sala a cincea: ramă, pantofi, port românesc

Ultima rundă de nemulțumiri, toate întemeiate.

- **Tălpile goale** de pe podea erau un oval cu cinci pete deasupra — se citeau ca
  niște mărgele scăpate. Refăcute dintr-un singur contur, apoi înlocuite cu **doi
  pantofi lăcuiți**, fiindcă tălpile palide nu se vedeau pe podeaua palidă.
- Pantofii se desenează **la urmă, peste tot**. Ținuți dedesubt, nu-i vedea nimeni
  tocmai când pânza acoperea ecranul — adică exact când erau singurul lucru care
  spunea unde stai.
- **Ultramarinul, încercat și lăsat.** O vreme sala n-a avut nici perete, nici
  podea, nici ramă: numai albastru și lucrarea plutind în el. Arăta mai bine cu
  sala. Dar atunci pânza are nevoie de **ramă aurită** — una de mărimea aia pusă
  direct pe zid arată a afiș.
- **Țăranii** aveau haine de nicăieri. Acum poartă port românesc: ie cu altiță,
  catrință vărgată, brâu, năframă, pălărie neagră, pieptar cu găitan, opinci.
  Altița a fost întâi două pete rotunde pe umeri și se citea ca doi ochi; năframa
  acoperea tot capul și femeia ieșea fără chip; brațul de repaus se așeza
  de-a curmezișul pieptului ca o curea de raniță.

**Verificare:** sala are perete și podea, pânza are ramă, pantofii se văd din
primul cadru, iar țăranii seamănă a ceva cunoscut.

## Faza 16 — Țăranii calcă, sala respiră, rama vine mai târziu

Trei nemulțumiri, toate despre lucruri care arătau *aproape* bine.

**„Bucățile de corp par decupate și lipite."** Erau. Mădularele se desenau după
trup, așa că fiecare își arăta muchia lipită de cămașă. Acum ordinea e inversă —
întâi picioarele, pe urmă mânecile, abia apoi trupul peste ele — iar mâneca are
capătul de sus rotunjit și îngropat în umăr. Peste tot, o modelare: cămașa prinde
lumina din stânga-sus, brâul se încovoaie pe trup în loc să stea ca o cărămidă,
catrința are șoldul luminat și cealaltă parte în umbră. O formă plată se citește
ca hârtie decupată oricât de bun i-ar fi conturul.

**„Ei nu merg, mai mult plutesc."** Nu mergeau: alunecau spre hambar cu
picioarele înțepenite. Prima încercare de mers i-a pus să se legene din șold, și
picioarele s-au încrucișat prin mijloc — **din față nu se poate arăta un pas din
legănat lateral**. Ce se vede dintr-un pas, privit din față, e că un picior se
ridică și se scurtează în timp ce celălalt rămâne pe pământ, și că trupul saltă
odată cu el. De-aia cele două picioare au faze opuse la ridicat și abia o urmă de
legănat. Brațele merg în contratimp și **nu trec niciodată peste piept**: un braț
rotit spre înăuntru se așază de-a curmezișul trupului ca o curea de raniță.

**Contrastul cald-rece în sală.** O notă de portocaliu pe unde bate lumina, una
de albastru în umbra din partea cealaltă. Discret: dacă le observi ca pe niște
culori, sunt prea tari. Sala rămâne albă, doar că nu mai e o coală de hârtie —
lumina adevărată n-are niciodată o singură temperatură.

**Intrarea, reașezată.** Se cerea: pixeli, pantofi, **nicio ramă**; abia pe urmă
rama și sala. Două lucruri stăteau în cale. Rama își arăta brâul de jos, fiindcă
lucrarea era centrată sus, ca un tablou pe perete — acum centrul urcă treptat, de
la mijlocul ecranului la locul unui tablou atârnat. Și curba de strâmtare: o
putere nu poate fi și înceată la început, și iute la sfârșit, așa că rama fie se
ivea din primul pas, fie nu mai apărea până la ultimul. Acum primii trei pași
abia o strâng — în ei se limpezesc doar pătratele — iar restul drumului face toată
depărtarea.

**Verificare:** la intrare nu se vede nici ramă, nici perete; la trei pași tot nu;
pe la șase apare rama și sala de sub ea; iar cei trei calcă spre hambar în loc să
alunece.

---

## Reguli care nu se calcă

1. **Niciun fișier extern.** Tot desenul și tot sunetul se nasc în cod.
2. **Se deschide de pe disc**, cu dublu-clic. De-aia `js/` sunt scripturi
   obișnuite, nu module.
3. **Tot ce ține de timp trece prin `dt`.** Nimic nu depinde de câte cadre pe
   secundă merge ecranul.
4. **Ce se pictează o dată se ștampilează.** Dacă un desen nu se schimbă de la un
   cadru la altul, n-are ce căuta în buclă.
5. **Nimeni nu rămâne blocat.** Orice loc unde trebuie făcut ceva anume are un
   semn care cheamă, și semnul se întărește cu cât treci mai mult fără să
   reușești.
6. **Ce se poate arăta nu se scrie.** Textul e ultima soluție, nu prima.
7. **Comentariile spun de ce, nu ce.**

## Teste

Se lucrează cu testul scris întâi. Testele stau în [teste.html](teste.html) și nu
au nevoie de nimic instalat. **Sunt 132 acum**, în douăsprezece secțiuni.

Ele nu copiază codul jucăriei: citesc `index.html`, iau de acolo lista fișierelor
din `js/` **în ordinea în care le încarcă pagina**, le adună și le rulează cu o
pânză falsă care ține minte ce s-a desenat și unde. Așa lista are un singur
stăpân — dacă apare un fișier nou, testele îl iau de la sine, și nu se poate
întâmpla ca pagina să ruleze un cod și testele altul.

Pânza falsă ține minte forme, culori, gradiente, text, filtre și imagini, așa că
un test poate să întrebe „câte forme s-au desenat aici", „ce scrie pe ecran", „e
vreo formă de culoarea asta" sau „câte operații a cerut cadrul". Ceasul e fals și
el, deci timpul se poate împinge înainte fără să aștepte nimeni.

Fiindcă testele citesc fișierele cu `fetch`, au nevoie de un server local — de pe
`file://` nu merg:

```
python -m http.server 8765
```

apoi `http://localhost:8765/teste.html`, pornit din folderul acesta.

**Când un test vechi se ceartă cu o cerere nouă**, testul se rescrie ca să apere
intenția care a rămas valabilă, niciodată slăbit în tăcere. Așa s-a întâmplat cu
mărimea ramei, cu destinația portalului și cu ordinea foilor din deschidere.

## Rămas de făcut

- **Acoperișul hambarului** din scena a cincea e încă un bulgăre brun.
- **La zece pași** rămâne mult perete gol în jurul lucrării. S-ar putea ca ea să
  nu trebuiască să se micșoreze chiar atât.
- **Documentele proiectului** (`.docx`, `.pdf`) stau în folderul de deasupra,
  netrimise pe GitHub: repo-ul e public, iar ele poartă numele întreg al unui
  copil.
- **Împărțirea în `js/`** e verificată numai prin faptul că testele trec: ele
  citesc lista din `index.html` și rulează exact fișierele pe care le încarcă
  pagina, în ordinea lor. Deci codul e bun. Ce n-a cântărit nimeni e **unde s-a
  tăiat**: dacă fiecare fișier ține un lucru întreg, sau dacă vreo funcție a
  rămas despărțită de cele cu care lucrează.
