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
| 17 | Muzică de Mozart, liniște în grădină, nouă îndreptări | ✅ gata |
| 18 | Un buzunar cu nume, fișe de sală, balonul care pocnește | ✅ gata |
| 19 | Sala rotundă a focului | ✅ gata |
| 20 | Grădina care îneca jocul | ✅ gata |
| 21 | Măsurile pânzei: cercelul, manualul, lagul | ✅ gata |
| 22 | Sala focului: lucrare culcată, pastă, blană, ușa arsă | ✅ gata |
| 23 | Pata picturală adevărată, și focul care are unde să ardă | ✅ gata |
| 24 | Scena 7 — sala de gheață și cele trei funcții ale costumului | ✅ gata |
| 25 | Două îndreptări la țărani: pieptarul din spate, strigătul | ✅ gata |
| 26 | Scena 8 — sala de ulei, amprenta și chepengul | ✅ gata |
| 27 | Un pumn de îndreptări cerute la fața locului | ✅ gata |
| 28 | Sala a opta, refăcută: desenul necolorat, trusa și cercul cromatic | ✅ gata |
| 29 | Scena 9 — sala acuarelei: hazardul fluid, lacul-oglindă, plonjonul | ✅ gata |

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
  urmă se duc la casă și-i deschid ușile.
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

**„Ei nu merg, mai mult plutesc."** Nu mergeau: alunecau spre casă cu
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
pe la șase apare rama și sala de sub ea; iar cei trei calcă spre casă în loc să
alunece.

## Faza 17 — Muzică de Mozart, liniște în grădină, nouă îndreptări

**Muzeul are acum o piesă**, nu un acord ținut — acordul suna a lift. E o
perioadă de opt măsuri în sol major, cu întrebare și răspuns, peste un bas
Alberti: jos, sus, mijloc, sus, semnul clasicismului vienez. Nu e nicio piesă
anume, ci o pastișă scrisă aici, notă cu notă, ca tot restul jucăriei. Melodia se
scrie în trepte de gamă, nu în frecvențe, ca să se poată citi ce cântă. Notele se
programează cu un pas înainte, pe ceasul sunetului, nu pe cel al cadrelor: al
doilea sare, primul nu, iar o piesă cântată pe ceasul cadrelor șchioapătă.

**În grădina custodelui nu mai vâjâie nimic.** Foșnetul de vânt se așeza peste
tot și acoperea tocmai liniștea din care se aud păsările. A rămas pentru câmpia
din scena a cincea, unde scena chiar e despre aer.

**Mingea speriată se întoarce.** Se ascundea după elefant și pe urmă se întorcea
sărind — dar întoarcerea se termina numai când două lucruri se nimereau în
același cadru: să fie aproape de locul ei și să atingă pământul. Cum sărea din
nou la fiecare aterizare, iar apropierea mergea cu pași tot mai mici, putea să
țopăie pe loc zeci de secunde. Asta era „elefantul ia mingea și o dă înapoi
târziu". Acum aterizarea o oprește, iar un răgaz o aduce înapoi oricum.

**Restul:** baloanele care așteaptă degetul s-au mărit — unul cât un bob de
mazăre se atinge greu, mai ales pe telefon. Țăranii au fiecare statura lui, pe
lângă cât îi micșorează depărtarea, fiindcă trei oameni croiți la fel arată a
decupaje din aceeași matriță. La plecare se micșorează toți, dintr-o singură
socoteală: doi care se depărtează și unul care stă pe loc rup depărtarea. În
câmp au apărut patru căpițe de fân — prima încercare le-a făcut tot din tușe, cu
paleta grâului, și s-au topit în el fără urmă; o formă se vede prin ce o desparte
de fond, nu prin conturul ei. Iar porunca celor zece pași se mută în stânga
pantofilor când n-are loc sub ramă.

**Verificare:** în muzeu se aude o frază cu mai multe trepte, nu un bâzâit; în
grădină nu vâjâie nimic; mingea speriată e înapoi în cel mult câteva secunde;
căpițele se văd; toți trei se micșorează la plecare; niciun rând scris nu se
așază peste un pantof.

## Faza 18 — Un buzunar cu nume, fișe de sală, balonul care pocnește

**Un singur buzunar, cât o ușă, cu GALERIE scris pe el.** Erau nouă, numerotate.
Nouă firide mărunte cu cifre se citeau ca un tablou de comandă: nu se vedea că se
deschid, se vedea că trebuie alese — iar alegerea era falsă, toate duceau în
aceeași galerie. Unul singur, cu numele gravat pe o plăcuță de alamă, spune
dintr-o privire și ce e, și că se apasă. Odată cu cele nouă au plecat și `s4.buzunar`,
`s5.buzunar` și indicele din `intraInGalerie` — o cifră care nu mai însemna nimic.

**Fișe de sală**, ca în orice muzeu: un titlu cu majuscule rărite și o propoziție.
Lângă miniatură scrie ce e o miniatură; lângă pânza cea mare, ce e impresionismul.
Înălțimea cartonului iese din text — rândurile se rup singure la lățimea dată, și
abia pe urmă se știe cât e de înalt — altfel orice propoziție mai lungă decât cea
la care ne-am gândit noi ar da pe dinafară.

**Balonul-mânuță pocnește.** Pe ultima foaie, atingerea îl sparge: poc, cioburi de
foiță care zboară în lături, și abia după ce s-au risipit se naște punctul. Jocul
nu mai pornește din atingere, ci din buclă, când pocnetul s-a terminat — ochiul
trebuie să apuce să vadă ce a făcut mâna lui, altfel atingerea și nașterea
punctului se calcă una pe alta și nu se înțelege că una a produs-o pe cealaltă.
Cioburile pleacă de pe marginea balonului, nu din mijlocul lui: foița se rupe pe
unde era întinsă, iar cioburile adunate în centru arată a pată, nu a spargere.

**Muzica s-a mutat înăuntru.** Cânta la elefant, adică afară, pe iarbă. Dar muzeul
e înăuntru, în galerii — acolo cântă Mozart, iar afară, în grădina custodelui, se
aud păsările și atât.

**Verificare:** haina deschisă arată un buzunar pe care scrie GALERIE și nicio
cifră; lângă fiecare lucrare stă fișa ei; atingerea de pe ultima foaie sparge
balonul și punctul se naște abia după; în galerie cântă, afară nu.

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
au nevoie de nimic instalat. **Sunt 140 acum**, în douăsprezece secțiuni.

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

## Etapa a nouăsprezecea — sala rotundă a focului

Scena a șasea, în `js/15-scena6-foc.js`. Se intră pe ușa casei din tabloul scenei
a cincea, care de-acum **așteaptă** în loc să te ia de mână: înainte, după nouă
secunde de uși deschise, scena se încheia singură și te ducea înapoi la custode.

Ce s-a făcut, în ordinea în care s-a lucrat:

1. **Sala rotundă.** Nu conturul o face rotundă, ci trei lucruri care se ajută:
   temelia peretelui, sus la mijloc și coborâtă la margini; cornișa, care o repetă
   răsturnată; și lesele de tapet, îndesite spre margini după un cosinus, unde
   peretele se vede din ce în ce mai din profil. Cu lesele la pas egal, cum erau
   întâi, sala rămânea o cutie tapetată oricâtă lumină turnai în mijloc.
2. **Pardoseala în tablă de șah.** La început se pictau numai pătratele închise,
   iar prin celelalte se vedea peretele — de-aia jumătate din tablă ieșea
   portocalie. Un alb care e de fapt tapetul de dedesubt nu e un alb.
3. **Tabloul pe șevalet**, vertical, în ramă prețioasă. Mutat de pe perete în
   mijlocul sălii: un tablou pe perete e un exponat terminat, unul pe șevalet e o
   lucrare la care se lucrează. Rama e aceeași sculptură ca în galeria a patra, în
   picioare, ștampilată o dată — și pregătită încă din scena a cincea, fiindcă
   sculptată la primul cadru se simțea poticnirea. A treia oară învățată lecția.
4. **Măsuța cu mănuși**, în dreapta șevaletului. Mănușile sunt de lucru, nu de
   piele veche: galben fluorescent, dungi roșii, platoșă peste articulații. O
   mănușă maro pe o masă maro, într-o sală galbenă, nu se vede — iar ea e singurul
   lucru pe care trebuie să-l găsești ca să poți merge mai departe.
5. **Focul din pânză**, care pulsează. Culoarea unei limbi ține de locul ei, nu de
   sămânța ei: legată de sămânță, ieșeau limbi albe pe margine și roșii în mijloc,
   adică un foc care nu știe unde îi e inima.
6. **Arsura.** Marginea se trage cu curbe prin mijlocul dintre puncte, peste trei
   sinusuri cu perioade care nu se împart una la alta. Cu raze trase la sorți și
   legate cu linii drepte ieșea o roată dințată — un semn desenat, nu o gaură
   mâncată de foc.
7. **Sunetul focului:** un suflu grav, continuu, și peste el pocnete puse la sorți
   pe ceasul audio. Numai suflul sună a aragaz; numai pocnetele, a cineva care
   rupe crengi.

Ce s-a scos pe drum: **caseta cu pictorii expresioniști**. Erau referințele după
care s-a pictat sala, nu ceva de citit în ea — unsprezece nume pe un perete cer să
fie citite, și atunci sala nu mai e despre căldura culorii, ci despre memorat.

Ce s-a mai reparat pe drum: `dt` nu mai poate ieși negativ. Un `dt` negativ nu
încetinește o scenă, o dă **înapoi** — aburii se îngroașă în loc să se limpezească,
iar faza nu se mai schimbă niciodată.

## Etapa a douăzecea — grădina care îneca jocul

„Odată ce ajungi la zona unde elefantul stă pe iarbă e extrem de mult lag, de nici
nu poți să-ți miști mausul."

Nu era de la numărul de forme, ci de la **numărul de pixeli**. În scena a doua, cu
grădina plină, fiecare cadru cerea peste o mie trei sute de operații de desen, iar
cele mai multe erau tocmai cele scumpe: imagini întinse pe suprafețe mari și
măsurători de text.

Trei lucruri se făceau din nou la fiecare cadru, deși nu se schimbau:

1. **Grădina din fund** — vreo optzeci și cinci de plante, fiecare o imagine
   întinsă pe pânză, plus o umbră. Înmulțit cu șaizeci de cadre pe secundă, iese o
   socoteală pe care o pânză n-o duce. Acum banda din fund se pictează o dată pe o
   pânză ascunsă și se copiază dintr-o singură mișcare: **510 operații → 3**.
   Plantele din fund pierd legănarea, și n-are importanță — sunt tocmai cele la
   care nu te uiți, iar un lucru depărtat se clatină oricum mai puțin. Banda din
   față, cea pe care chiar o vezi, se desenează în continuare plantă cu plantă.
2. **Definițiile de pe fundal** — un text întins de la o margine la alta se
   măsoară cuvânt cu cuvânt, ca să știi cât spațiu pui între ele. Ieșeau aproape
   șaptezeci de măsurători și douăzeci de rânduri scrise pe cadru, pentru un text
   care nu se schimbă niciodată. Măsurătoarea de text e una dintre cele mai scumpe
   întrebări pe care le poți pune unei pânze: **91 operații → 1**.
3. **Petele de pe pământ** — șaizeci de pete cu câte patru-cinci stropi fac vreo
   cinci sute de cercuri umplute pe cadru, pentru niște pete care, odată căzute, nu
   se mai clintesc. Se mișcă numai cele pe care le soarbe elefantul, și acelea sunt
   una-două: **~500 operații → 1**, plus cele câteva care chiar zboară.

Pe deasupra, cele două zugrăveli ale fundalului (cerul și pământul) se făceau din
nou la fiecare cadru; acum se țin minte până se schimbă fereastra.

**Un cadru cu grădina plină: 1308 operații → 484.** Câștigul în pixeli e mai mare
decât în operații, fiindcă tocmai lucrurile scoase erau cele care acopereau
suprafețe mari.

Și regulatorul de calitate reacționează altfel când jocul chiar se îneacă: dacă un
cadru ține peste patruzeci de milisecunde, coboară după șase zecimi de secundă și
dintr-odată cu două trepte, în loc să aștepte două secunde și jumătate pentru
fiecare. Cele șapte secunde de smucituri de dinainte erau exact timpul în care omul
crede că jucăria e stricată.

## Etapa a douăzeci și una — măsurile pânzei

„În scena când elefantul se așează pe iarbă e mult lag și e un bug: cercelul se
face lung și mare, și la fel și manualul."

Trei fețe ale aceleiași cauze. Nu desenăm pe ecran, ci pe o **pânză plafonată**,
întinsă pe urmă cu CSS peste toată fereastra; iar `reglezaCalitatea` o mai
micșorează o dată când cadrele întârzie. `W` și `H` nu sunt fereastra, iar
raportul dintre ele și fereastră se schimbă în timpul jocului. Scena a treia nu
era pregătită pentru asta.

1. **Cercelul lung și mare.** `s3.butonBaza`, `s3.butonX/Y` și `s3.butonR` se
   socoteau o singură dată, la intrarea în scenă, în pixeli de pânză. Când pânza
   cobora de la 1450 de pixeli la 800, cercelul rămânea la coordonata veche —
   adică în dreapta ecranului, cu lănțișorul întins de la ureche până acolo, și
   cu raza de dinainte, deci mare cât o roșie. Leacul: o listă `laRedimensionare`,
   în care fiecare scenă își lasă un ascultător și își mută lucrurile în noua
   măsură. Au primit câte unul cursorul, balonul cu urma lui, mingea cu elefantul
   și petele, cercelul și lupa. Grădina n-a avut nevoie: ea își ținea de la bun
   început plantele în fracțiuni de ecran.

2. **Manualul mare.** `Math.min(W * 0.42, 470)`. Cei 470 sunt pixeli ficși: pe
   pânză întreagă cartea ieșea o treime din lățime, pe pânză micșorată sărea la
   42%. La fel diploma, scrisoarea, bilețelele, plicul și toate literele scrise
   `20px`. Acum trec prin `ecran(470)` și `scrisGeorgia(20)`, care traduc pixelii
   de ecran în pixeli de pânză.

   Tot de aici a ieșit și un lucru vechi, care nu se vedea: **titlul deschiderii
   nu încăpea pe ecran**. „VIAȚA DINTR-O ATINGERE", cu răriturile dintre litere,
   măsura 112% din lățime pe o fereastră de laptop — se tăia de amândouă
   marginile, la orice calitate. Acum se măsoară și se strânge, literă și rărire
   deodată.

3. **Lagul.** Bucla vicioasă. Fiecare treaptă de calitate repictează din temelii
   fundalul grădinii **și** toată sala galeriei, care se pregătește din vreme
   tocmai cât ții manualul în mână. Cadrul acela dura mult, intra în media de
   fluență, media zicea „ne înecăm", deci mai cobora o treaptă — care repicta iar
   tot. Iar când urca înapoi, se îneca din nou și cobora: un balans fără sfârșit,
   cu o repictare completă la fiecare tur.

   Trei îndreptări: cadrul schimbării nu se mai măsoară; o treaptă care s-a înecat
   la scurt timp după ce am urcat la ea se închide (`plafonCalitate`), așa că
   balansul se stinge în două-trei tururi în loc să țină la nesfârșit; iar
   redimensionările de la tras de fereastră se adună într-una singură.

Cinci teste noi apără toate astea: cercelul rămâne la ureche peste o
redimensionare și nu se umflă când coboară calitatea, manualul păstrează aceeași
parte din ecran, mingea și elefantul își țin locul, iar calitatea nu se mai
leagănă la infinit.

## Etapa a douăzeci și doua — sala focului, pusă în pastă

Șase cereri deodată, toate despre aceeași sală. Le-am luat pe rând.

1. **Lucrarea e culcată, nu în picioare.** Un foc de tabără e un lucru lat: are
   noapte de-o parte și de alta, are dealuri în fund, are jar întins pe jos. Pe o
   pânză înaltă tot ce nu e flacără se pierde, iar focul ajunge o lumânare în
   mijlocul unui perete de întuneric. Rama prețioasă s-a întors și ea: sculptura
   ei se pictează la chiar proporțiile pânzei, fiindcă întinsă dintr-una înaltă
   peste una lată, aceeași floare s-ar fi văzut turtită pe laturi.

   Șevaletul a cerut două îndreptări pe care nu le prevăzusem. Polița ieșea de sub
   pânză cu patruzeci la sută din lățimea ei — o palmă la o pânză îngustă, o
   bancă la una culcată. Iar picioarele din față, care înainte stăteau strânse
   lângă catarg, au ajuns de-o parte și de alta a lucrării și răsăreau peste ramă
   ca o poartă de fotbal. Acum urcă numai până sub muchia de sus a pânzei;
   deasupra rămâne doar catargul cu clema, atât cât are un șevalet.

2. **Mai în față.** Împinse în fund, pe o pânză mică, sala rămânea un hol gol cu
   un afiș la capăt — rotundă degeaba, fiindcă privirea n-avea ce să ocolească.
   Lucrarea coboară acum sub linia orizontului, iar șevaletul calcă la 96% din
   înălțimea ecranului. Măsuța cu mănuși s-a mutat în stânga: în dreapta n-o mai
   încape pânza lată, și oricum acolo urma să se deschidă o ușă.

3. **Pereții din pete de pastă.** Trei sute de tușe mari peste tapet, plus vreo
   patruzeci apăsate, din cele care se văd din capătul sălii. Culoarea fiecăreia
   se ia din locul ei — aprinsă în mijloc, unde bate focul, brună spre margini —
   nu la sorți: la sorți, clarobscurul pictat cu grijă în gradient s-ar fi pierdut
   sub un perete pestriț. Prima încercare avea șase sute de fleculețe mărunte și
   arăta a tencuială stropită: se vedea zgomot, nu pensulă.

4. **Și lucrarea, tot în pastă.** Noaptea și dealurile din spatele focului erau
   întinse cu gradientul — o suprafață lucioasă de sticlă, peste care focul, pus
   din tușe, părea lipit. Acum sunt din același material, și atunci ochiul poate
   să judece ce deosebește o pată fierbinte de una rece: nu felul cum e pusă, ci
   valoarea ei. Asta e toată lecția scenei, dată fără un cuvânt scris. Fondul a
   plecat pe ștampila lui, deci un cadru al lucrării costă acum **mai puțin**
   decât înainte, nu mai mult.

5. **Blana de pe jos.** Tabla de șah e reperul neutru al sălii, și tocmai de-aia
   sala, cu foc cu tot, rămânea o încăpere de muzeu în care nu ți-ar veni să
   stai. O blană întinsă sub șevalet și sub măsuță le strânge într-un singur loc
   locuit. Prima era crem-alb și, peste tabla de șah, arăta a baltă de var: cea
   mai deschisă valoare din toată sala, adică exact ce nu trebuie pe jos. Miere
   ars, cu umbre brune — stă sub lucrare fără să i-o ia înainte.

6. **Arsura, pe peretele din dreapta.** În mijlocul peretelui din fund se ascundea
   pe jumătate în spatele șevaletului și arăta a gaură: se vedea prin ea, dar nu
   se înțelegea că se poate intra. Pe latura din dreapta, mai înaltă decât lată și
   sprijinită pe podea, se citește **ușă** — și e chiar drumul pe care a venit
   focul, fiindcă întâi arde colțul de jos-dreapta al ecranului, iar arsura urcă
   de acolo.

   Două lucruri au ieșit la iveală abia desenând. Marginea arsă fâlfâie, deci
   trecea de linia unde peretele întâlnește pardoseala și gaura se revărsa peste
   tabla de șah ca o baltă; acum tot ce ține de arsură se taie la perete. Și
   invers: pe un ecran înalt, la unele unghiuri rămânea o palmă de tapet între ușă
   și podea — o ușă care nu atinge podeaua e o fereastră. Centrul s-a coborât cât
   să treacă întotdeauna de prag și să fie tăiat de el.

   Locul arsurii se scoate acum dintr-un singur loc, `geomArsura`: și desenul, și
   locul pe care apeși, și testele. Cât erau trei socoteli scrise una lângă alta,
   gaura se putea muta din desen fără să se mute și atingerea.

Șapte teste noi: lucrarea e culcată, lucrarea și șevaletul stau în planul întâi,
pereții au creste de pastă, fondul lucrării la fel, fondul nu se repictează la
fiecare cadru, blana ajunge și sub măsuță și sub șevalet, iar arsura e o ușă pe
peretele din dreapta, sprijinită pe podea și fără să încalece lucrarea.

## Etapa a douăzeci și treia — pata picturală, și focul care are unde să ardă

Trei lucruri, cerute cu fotografii pe masă: pata de pastă să fie pastă adevărată,
scânteia să sară pe perete și să ardă în sus, iar spațiul din spatele șevaletului
să nu mai fie atât de adânc.

### Pata

Prima variantă a tușei era o elipsă cu două pene deschise pe margini. De aproape
se vedea limpede ce e: un ou de culoare, moale pe toate laturile. Vopseaua groasă
se pune cu cuțitul, și cuțitul lasă cu totul altceva — muchii drepte cu colțuri,
un capăt gros unde s-a lăsat lama și unul rupt unde s-a ridicat, o creastă care
prinde lumina pe o muchie și o umbră pe cealaltă, râcâituri pe dinăuntru.

Creasta a trebuit refăcută de două ori. Umplută cu o pană, acoperea o treime din
lățimea petei: ieșea o lamă crem cu un pic de culoare pe la mijloc, adică se
vedea creasta, nu vopseaua. O creastă e o **dungă**. Acum se face din același
contur, mutat puțin și trasat cu linie groasă, tăiat la forma petei.

Mărimea și așezarea au cerut trei încercări:

1. **Șase sute de fleculețe mărunte, la sorți** — o tencuială stropită. Zgomot,
   nu pensulă.
2. **Două sute de pete cât palma** — frunze împrăștiate pe perete. O tușă care se
   vede de la doi metri nu mai e o tușă, e un obiect.
3. **Rețea cu zvâcnet**, câte o tușă pe ochi, mutată din locul ei cu ceva mai
   puțin de un ochi și lungă cât doi. Abia atunci tușele se ating și acoperă. La
   sorți curat, oricâte ar fi, se adună în ciorchini și lasă goluri — iar golurile
   sunt tocmai vopseaua de dedesubt, care se vede și strică tot.

Și un raport care nu se vede până nu-l greșești: o tușă groasă cât e de lată se
citește piatră de caldarâm. Lama e lungă; urma ei e de patru-cinci ori mai lungă
decât lată.

Pasta a intrat peste tot: pereții, **pardoseala** (tabla de șah rămâne reperul
neutru al sălii, dar acum se vede pictată, nu turnată), rama, fondul lucrării și
focul din ea. Culoarea urmează regula expresionistă — valoarea urmează lumina,
tonul sare de la o tușă la alta.

### Rama

Rama prețioasă din galeria a patra a plecat. Aceea e o ramă de muzeu: sculptată,
aurită, a unui tablou terminat, clasat, atârnat. Aici suntem în atelierul cuiva
care lucrează, iar pe pereții lui lucrările stau în rame late și simple, de lemn
vopsit. O ramă bogată în jurul unei lucrări de pe șevalet spune că lucrul s-a
terminat — și atunci scânteia care sare din ea n-ar mai avea de unde să sară.

### Focul care are unde să arde

Scânteia sare acum din pânză **spre peretele din dreapta**, la temelia lui, exact
în locul din care va crește ușa. Peretele ia foc acolo și arde în sus; arsura
urcă odată cu flacăra, cu pragul rămas pe podea. `s6.colt` s-a făcut
`s6.flacara`: nu mai arde un colț de ecran, arde un perete.

Peste asta, trei lucruri pe care le cere orice tapet care arde:

- **funinginea** — deasupra flăcării peretele se înnegrește pe o suprafață de
  câteva ori mai mare decât ea, într-un evantai care se lățește în sus. E singurul
  lucru din scenă care rămâne: flacăra trece, funinginea nu.
- **fumul din sală** — puțin, strâns sub cornișă, cum face fumul într-o încăpere
  închisă. Se risipește după aceea, dar nu de tot.
- **marginea de material ars** — patru brâuri, unul în altul: pârleala cafenie
  care se pierde în tapet, brâul rumenit, cărbunele de pe buză și franjurii de
  fibre rupte care ies din contur. Franjurii nu stau la pas egal de jur împrejur —
  așa ies gene, nu hârtie arsă; se rup în pâlcuri, iar pe unele bucăți de margine
  focul a mâncat curat.

Aici a ieșit la iveală o greșeală de canvas care se vedea din prima, dar nu se
explica: gaura era maro, nu albastră. Pârleala din jur se face din două contururi
puse în același traseu, umplute cu regula par-impar, ca să lase gol mijlocul —
numai că `conturArsurii` începea de fiecare dată un traseu nou, deci al doilea
contur îl ștergea pe primul. Inelul devenea disc, iar maro-ul se turna peste toată
gaura, adică peste singura culoare rece din toată scena, care e tot rostul ei.

### Sala

Orizontul a coborât de la 60% la 54% din înălțime și fundul sălii s-a lărgit: cu
tot ce se petrece în ea, sala arăta ca un hol lung, iar între șevalet și peretele
din fund rămânea un pustiu prin care nu trece nimeni. Lucrarea a crescut și a
urcat până aproape de cornișă — un perete gol deasupra ei o face să pară o poză
agățată, nu lucrul pentru care s-a deschis sala — iar șevaletul calcă acum la 88%
din înălțime, ca în față să rămână pardoseala pe care stai tu.

Ușa s-a mutat mai spre margine, la 85% din lățime: la 80% intra cu marginea peste
rama lucrării și se ascundea pe jumătate în spatele ei, adică redevenea ce era la
început — o gaură, nu o trecere. Iar îndemnul „Intră prin arsură" stă acum chiar
sub prag: un îndemn scris în altă parte decât lucrul despre care vorbește îl
trimite pe om să caute.

Șase teste noi: scânteia sare pe peretele din care crește ușa, peretele arde de
jos în sus cu pragul pe loc, funinginea se strânge deasupra flăcării și rămâne,
fumul se face și se risipește, marginea are franjuri și pârleală, iar cenușa rece
se vede în continuare prin ușă.

## Etapa a douăzeci și patra — sala a șaptea, de gheață

Prima scenă nouă de la sala focului încoace, și prima care nu se sprijină pe
căldură, ci pe lipsa ei. Se intră prin arsura din peretele sălii a șasea — drumul
era croit acolo cu un singur rând de schimbat, și acum s-a schimbat.

Tema: senzația termică prin culoare rece, și designul vestimentar ca artă
decorativă. Se învață cele trei funcții ale costumului — protecție, utilitate,
estetică — nu citindu-le de pe un panou, ci pornindu-le una câte una și simțind
ce se schimbă în cameră după fiecare.

**De ce vine imediat după foc.** Acolo totul era cald, gras, pictat cu cuțitul, cu
marginile moi de pastă. Aici totul e rece, plat, tăiat — plane suprapuse și
vectori ascuțiți, cubism și vorticism. Ochiul care tocmai a stat cinci minute în
galben simte albastrul ăsta ca pe o palmă. Contrastul dintre cele două săli e
chiar lecția, și niciuna nu l-ar putea da singură.

**Frigul, în deget.** Nu se poate răci mâna nimănui, așa că se răcește cursorul.
Sala își ține degetul ei, care aleargă după cel adevărat cu o iuțeală ce ține de
cât de cald e: 10% dacă ai atins lucrarea cu mâna goală, 45% cât ține frigul
sălii, 1:1 după funcția de utilitate. Sub 45% nu se coboară niciodată în afara
înghețului — un cursor care nu ascultă nu e o senzație, e o defecțiune.

Din îngheț nu se iese apăsând, ci frecând: fiecare schimbare de sens a mâinii
umple o bară, iar la capăt gheața pocnește, ecranul tremură și cioburile zboară
spre margini. Frecarea se măsoară pe mâna adevărată, în ascultătorul de mișcare —
pe degetul întârziat n-ar fi simțit nimeni nimic, fiindcă cine scutură mouse-ul
scutură mai repede decât apucă degetul înghețat să-l urmeze.

**Cele trei funcții.** Sub costum stau trei forme, fiecare cu silueta ei: un scut,
o roată dințată, o prismă. Un scut se recunoaște că apără, o roată că lucrează, o
prismă că desface lumina — și așa funcțiile se țin minte după formă, nu după
rândul scris sub ele. Apeși pe una: în caseta din dreapta se scrie definiția, iar
pe costum se întâmplă altceva de fiecare dată.

Bariera de la protecție a cerut o îndreptare pe care ne-a arătat-o chiar textul
funcției: fișa spune că **se extinde o barieră geometrică ce curăță promoroaca de
pe ecran**. Prima variantă lăsa bruma să se stingă singură — adevărat, dar nu ce
scria. Acum bariera pleacă din fular și mătură ecranul, iar bruma se desenează
numai în afara ei: se vede cum curăță.

Roata a cerut altă lămurire. Nu leagă ea liniile de forță, le **trezește**;
legatul rămâne al jucătorului. O mașină care face fapta în locul tău nu te învață
la ce e bună.

Podoaba costumului nu e nici broderie, nici curea. O curea e un obiect de
utilitate, broderia ar fi din altă lume — caldă, țesută. Într-o sală de gheață,
podoaba se taie din același material ca sala: un șir de cristale cu fețe, peste
mijlocul hainei, din care pleacă mai încolo reflexiile de pe pereți.

**Costumul, cubist.** Lângă haina văzută din față stau spatele ei, profilul din
latură și un petic de căptușeală cu buzunarul la vedere — bucăți care în realitate
n-au cum să se vadă în același timp. Nu e un ornament: exact asta face un tipar de
croitorie. La deschiderea portalului, obiectul face singur ce a făcut pictorul cu
el: se desface în bucăți care se depărtează și se strâng la loc, iar prin golul de
la mijloc se vede tunelul.

**Ce s-a nimerit greu.** Trei lucruri, toate din aceeași pricină — un desen care
arăta altceva decât spunea:

1. **Promoroaca** era întinsă peste tot ecranul. Sala dispărea sub ea, iar
   promoroaca nu mai era o ramă, era o perdea. O ramă îngheață privirea; o perdea
   o oprește, iar un jucător care nu vede nimic nu simte frig, simte că s-a
   stricat ceva.
2. **Costumul** nu se citea a costum: o cutie cu o curea peste mijloc. A trebuit
   să capete mâneci cu cotul frânt, nasturi, revere, tiv — și o etichetă dedesubt.
   Toată scena se sprijină pe faptul că știi de la bun început că e o haină.
3. **Fularul** înghițea atingerile vecinilor. Îi dădusem o rază de peste două ori
   cât el, ca să fie ușor de nimerit, și atunci apăsai pe nasturi și ți se
   aprindea protecția. Un obiect care fură atingerile din jur face din trei părți
   una.

Și un lucru pe care l-am dus prea departe înainte să-l aduc înapoi: **cristalele
de pe podea**. Fără ele sala arăta a navă spațială — linii neon, plane albastre,
vârtej: totul spunea „viitor", nimic nu spunea „gheață". Trei bolovani de gheață
pe jos schimbă cuvântul dintr-o dată, fiindcă ei sunt singurul lucru din cameră pe
care ochiul îl recunoaște fără să-l gândească.

**Sunetele** sunt și ele opusul celor din sala focului, nu focul dat mai încet:
vânt de munte înfundat (zgomot alb printr-un trece-bandă strâns, nu printr-un
trece-jos, care ar fi ieșit tot un duduit cald), pași neregulați pe zăpadă, iar la
activarea funcțiilor metal — două note la o cvartă mărită, intervalul cel mai
tăios din câte sunt. La sfârșit, o turbină care urcă.

Douăsprezece teste noi pentru sala asta, plus două pentru scena cu țăranii.

## Etapa a douăzeci și cincea — două îndreptări la țărani

1. **Pieptarul, văzut din spate.** Pe piept se încheie și lasă cămașa albă la
   vedere pe mijloc; pe spate n-are nicio deschizătură. Cu aceleași două canaturi
   și când se întorcea, îi rămânea o dungă albă pe șira spinării — cămașa văzută
   printr-o despicătură pe care haina n-o are. Acum, din spate, e o singură foaie
   neagră, cu găitanul ocolind pe margine și o cusătură pe mijloc.
2. **Strigătul lor** cădea peste pantofi. Ei sunt singurul lucru din sală care
   spune unde stai tu, iar un rând scris peste ei îi taie în două. Acum plăcuța
   se așază în gura liberă dintre tălpi și marginea de jos a lucrării, ca și
   porunca de deasupra.

## Etapa a douăzeci și șasea — sala a opta, de ulei

> Sala descrisă aici a fost refăcută din temelii la **etapa a douăzeci și opta**:
> pereții de sac, manechinul și pensula luată de pe lucrare nu mai există. Ce
> urmează e cum a fost, și de ce — tema și chepengul au rămas.

Tema: amprenta fizică. O lucrare în ulei nu e o imagine, e **materie** — o pastă
care stă pe pânză, care se usucă zile întregi, care se ia pe deget dacă o atingi.
Sala asta e singura din toată jucăria în care jucătorul nu se uită la o lucrare,
ci face una: pereții sunt pânza lui.

**De ce vine după gheață.** Acolo totul era tăiat, rece și rigid: nu puteai
atinge nimic fără să înghețe, iar mișcarea îți era luată. Aici e exact pe dos —
cald, gras, moale, și ți se dă voie peste tot. Sala a șaptea îți ia libertatea ca
s-o simți; a opta ți-o dă înapoi cu vârf și îndesat. Și mai e ceva, care leagă
toate sălile de dinainte: ai trecut prin galerii în care nu se pune mâna, iar
aici scrie pe perete că muzeul e pânza ta.

**Cum merge.** Pensula vine de la lucrare, nu de la intrare: până nu pui degetul
în vopsea, nu știi că e udă, iar dacă nu știi asta, „muzeul e pânza ta" e o vorbă
goală. Pe urmă mânjești oriunde — inclusiv lucrarea, ar fi caraghios s-o apere
tocmai omul care ți-a spus că sala e a ta. Tot ce lași rămâne, pe o pânză ascunsă
care se copiază la fiecare cadru dintr-o singură mișcare.

**Chepengul.** Ușa spre sala a noua nu e pe perete, e **în podea**. Trei lucruri
se leagă odată cu asta: vopseaua grea curge în jos, deci un strat gros pus pe o
podea se scurge în crăpătura de sub el (pe un perete ar fi trebuit să inventăm de
ce cade); ce urmează e apa, iar acuarela stă dedesubt, deci se coboară în ea, nu
se trece alături; și mânjitul unei podele e cu totul altceva decât al unui perete
— te apleci peste ea, o calci, e a ta.

Prima variantă tăia ferestre în albul de plumb pe unde treceai cu pensula. La o
sută la sută acoperire, ușa era deja toată la vedere — și atunci ce urma n-avea ce
să descopere. Acum e pe dos: cu cât pui mai multă pastă, cu atât se ghicește mai
tare muchia de dedesubt, iar la capăt capacul se ridică singur, cu vopseaua ta
lipită pe el, și restul se scurge peste buză în gaură. Ce rămâne nu e o ușă făcută
de joc, ci una care era acolo tot timpul — asta schimbă înțelesul faptei din „ai
desenat o ușă" în „ai găsit-o".

**Ce am învățat despre impasto.** Cinci lucruri, toate greșite la prima încercare
și îndreptate pe rând: tușele trebuie **opace** (transparente ies o glazură, adică
tehnica opusă); raportul e de vreo doi la unu, nu de șapte (lungi și subțiri se
ascut în sulițe); se pun pe o rețea mai deasă decât sunt ele de mari, ca să se
calce una pe alta; culoarea se ia pe zone, nu la sorți (altfel ies boabe de porumb
împrăștiate); și mărimea trebuie să sară mult, altfel iese un model de tapet.

Peste toate, **suportul trebuie să se vadă**: pasta stă în ostroave, iar între ele
se zărește pânza goală. Acoperit peste tot, sacul dispărea cu totul.

**Țesătura de sac** e urzeală și bătătură, nu două rânduri de dungi suprapuse: în
fiecare ochi se vede care fir trece deasupra, ca la tabla de șah. Prima variantă,
cu dungi, dădea o grilă; a doua, cu tonuri prea depărtate, dădea o tablă de șah
cenușie. Ce trebuie e o sclipire măruntă, nu un contrast.

**Sunetele** au fost și ele refăcute: primele ieșeau păcănituri, fiindcă `zgomot`
urcă în două sutimi și se oprește la fel de sec. Un sunet cleios cere atac lent
(vopseaua nu pocnește, se desprinde), filtru rezonant (sună a cavitate, nu a
sâsâit) și frecvență care cade în timp ce sună. Plus desprinderea de la sfârșit —
clipa în care pensula se ridică.

Nouă teste noi pentru sala asta.

## Etapa a douăzeci și șaptea — un pumn de îndreptări cerute la fața locului

Toate din aceeași sesiune, toate din uitatul pe ecran:

- **Fișele de sală se paginează centrat**, în toate scenele. Întinse de la o
  margine la alta, arătau a coloană de ziar: ultimul rând atârna în stânga, iar
  cuvintele scurte se depărtau ca să umple lățimea. O inscripție de perete nu se
  justifică.
- **Vesta custodelui** se taie acum la trupul lui, iar tăietura se lărgește odată
  cu deschiderea. Închisă, e mulată; descheiată, poalele atârnă lângă el, cu cute
  și cu tivul legănat — înainte se retezau drept la marginea burții și arătau ca
  două bucăți de tablă.
- **Țăranii se întorc când dai clic pe ei.** Înainte plecau singuri, după cinci
  secunde: te chemau cu vorba lor scrisă, tu dădeai clic, nu se întâmpla nimic,
  iar când renunțai se întorceau din senin. Un om care te cheamă și nu răspunde
  când te duci la el nu te-a chemat, s-a întâmplat să strige.
- **Baloanele de culoare** din scena a doua primesc o săgeată care pulsează. Am
  scris o vreme și ce ai de făcut, dar o jucărie care îți spune „atinge-le" te
  tratează ca pe un om care n-a înțeles — iar scena de până acolo nu ți-a cerut
  nici să atingi punctul, nici să prinzi balonul.
- **Notificarea oficială** și-a pierdut semnătura, iar foaia se croiește acum
  după scris: o hârtie cu jumătate de pagină albă arată a formular neterminat.
- **Fișa din sala de gheață** a rămas una singură, vorticismul, centrată pe
  peretele din stânga. Două fișe acopereau tot peretele cu text, iar definiția
  vorticismului o cuprinde oricum pe a cubismului. Cubismul rămâne în sală acolo
  unde îi e locul: în costumul desfăcut în față, spate și laturi.
- **Eticheta „COSTUM VORTICIST"** a plecat. Am pus-o ca să se știe din prima ce e
  obiectul, dar între timp costumul a căpătat mâneci, nasturi, revere și salbă de
  cristale — se recunoaște singur.

## Etapa a douăzeci și opta — sala a opta, refăcută din desenul Danielei

Prima sală a opta spunea prost ce avea de spus. Pereții erau de pânză de sac,
gata acoperiți cu impasto, iar lucrarea centrală era o mantie pictată pe un
manechin: intrai într-o cameră deja lucrată de altcineva și, ca să-ți lași
amprenta, trebuia să mânjești peste munca lui. „Spațiul este pânza ta" scris pe
un perete care e deja pictat e o contradicție, nu o invitație.

Sala e acum **desenul făcut de mână** pentru jocul ăsta: o sală de muzeu
neoclasică, în linie, complet necolorată. Hârtie albă, contur de creion, vitrine
cu vaze, un podium cu funii și, pe el, o pelerină regală. Nimic nu e colorat
dinainte — nici măcar textura pereților, fiindcă și o textură pusă de dinainte e
tot o hotărâre luată în locul jucătorului.

**Ce are jucătorul la îndemână.** Sus în stânga, o trusă cu șase ustensile:
pensulă rotundă, pensulă lată, pensulă de tuș, bidinea, cuțit ascuțit, cuțit lat.
Sub ea, cercul cromatic cu douăsprezece raze, în ordinea roții — fiecare culoare
între cele două din care se face. Alegi una și una, și pui pastă unde vrei.
Ustensilele lasă urme cu adevărat diferite (cuțitele lespezi, pensulele fire),
altfel alegerea lor ar fi fost un buton fără urmare. Deasupra trusei stă
îndemnul: „Spațiul este pânza ta. Lasă-ți amprenta. Personalizează spațiul."
Fișa de sală, cea despre pigmenți, s-a mutat sus în dreapta, pe peretele din
fund — unde stau fișele într-un muzeu adevărat.

**Ce deschide chepengul.** Poți picta oriunde, dar numai **pelerina** deschide
drumul: acoperită de tot, sub ea se dă la o parte un chepeng, culoarea se scurge
acolo, și pe acolo se intră mai departe. Dacă s-ar fi socotit toată sala, ai fi
deschis chepengul mâzgălind un colț de perete — și n-ar mai fi fost o lucrare
terminată, ci un contor umplut.

**Croiala, scrisă o singură dată.** Conturul desenat și socoteala acoperirii ies
amândouă din `PROFIL_PELERINEI` — un tabel care spune, pentru fiecare înălțime,
cât e pelerina de lată. Scrise separat, s-ar fi despărțit la prima schimbare: ai
fi colorat o pelerină și ai fi acoperit alta. Prima variantă desena conturul pe o
pânză de lucru și îi citea pixelii cu `getImageData` — corect, dar cel mai scump
lucru pe care i-l poți cere unei pânze, și cu totul de neîncercat, fiindcă pânza
prefăcută din teste n-are pixeli de citit.

**Silueta.** A luat trei încercări. Prima era cât podiumul de lată, o cupolă care
înghițea sala. A doua se lățea uniform de sus până jos — adică un abajur. Ce
deosebește o mantie de un clopot sunt **umerii cei mai lați de sus** și
**strângerea de la talie**: fără oprirea aia, orice contur care crește la vale se
citește ca un clopot, oricâte broderii i-ai pune. Cutele stofei urmează același
tabel, ca să se strângă și ele unde se strânge materialul.

Unsprezece teste noi pentru sala refăcută (232 în total). Cele vechi vorbeau
despre un manechin, o ușă pe perete și o pensulă care se ia de pe lucrare —
lucruri care nu mai există.

## Rămas de făcut

- **Pridvorul casei** din scena a cincea e văzut din față, plat: stâlpii și
  arcadele nu au adâncime.
- **La zece pași** rămâne mult perete gol în jurul lucrării. S-ar putea ca ea să
  nu trebuiască să se micșoreze chiar atât.
- **Documentele proiectului** (`.docx`, `.pdf`) stau în folderul de deasupra,
  netrimise pe GitHub: repo-ul e public, iar ele poartă numele întreg al unui
  copil.
- **Elefantul și banda din față a grădinii** sunt acum cele mai scumpe lucruri
  dintr-un cadru al scenei a doua (vreo trei sute cincizeci de operații din patru
  sute optzeci). Dacă mai e nevoie de aer, de acolo se ia.
- **Ce urmează după ziar.** Sedimentarea din sala a noua se încheie cu un ziar
  îngălbenit și cu pârâit de vinil — începutul sălii a zecea, care încă nu e
  făcută. Până va fi, `iesiDinAcuarela` te scoate înapoi la custode, ca la
  arsură, ca la vârtej și ca la trapa uleiului — și tot ca acolo, când va fi, se
  schimbă un singur rând.
- **Șevaletul** e văzut drept din față. Piciorul din spate îl sprijină, dar sala
  e rotundă și lucrarea stă în mijlocul ei: la un moment dat ar merita văzut
  puțin din trei sferturi, cum îl vezi când intri pe ușă.
- **Fișa de sală din sala focului**, pe un ecran înalt și îngust, se strânge într-o
  coloană de un cuvânt pe rând. Panoul își ține lățimea în fracțiune de lățime a
  ferestrei, iar pe vertical rămâne prea îngust pentru textul lui.
- **Împărțirea în `js/`** e verificată numai prin faptul că testele trec: ele
  citesc lista din `index.html` și rulează exact fișierele pe care le încarcă
  pagina, în ordinea lor. Deci codul e bun. Ce n-a cântărit nimeni e **unde s-a
  tăiat**: dacă fiecare fișier ține un lucru întreg, sau dacă vreo funcție a
  rămas despărțită de cele cu care lucrează.
