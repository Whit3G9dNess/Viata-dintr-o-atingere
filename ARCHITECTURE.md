# ARCHITECTURE.md

Document de referință pentru structura tehnică a jucăriei.

> **Stare curentă:** opt scene întregi și jucabile, 230 de teste care trec.
> Rulează fără server, cu dublu-clic pe `index.html`. Nu are build, nu are
> dependențe, nu are backend.

## Privire de ansamblu

O pagină de canvas 2D, fără biblioteci și fără niciun fișier luat de undeva —
nici imagini, nici sunete. Tot ce se vede iese din `CanvasRenderingContext2D`,
tot ce se aude iese din WebAudio, notă cu notă. `index.html` nu conține cod: e o
listă de șaptesprezece scripturi obișnuite, încărcate în ordine.

```mermaid
flowchart LR
  subgraph BROWSER["Browser (dublu-clic pe index.html, fără server)"]
    direction LR
    IDX["index.html<br/>listă de scripturi"]
    subgraph JS["js/*.js — șaptesprezece fișiere, în ordine"]
      direction TB
      TEMELIE["Temelia<br/>01 pânză · 02 cursor<br/>03 sunete · 04 stări"]
      SCENE["Scenele<br/>05 balon · 06 minge · 11 muzeu · 12 galerie<br/>13 câmpie · 15 foc · 16 gheață · 17 ulei"]
      DESEN["Desenul<br/>08 fundal · 09 mânuță<br/>10 scenele 1-2"]
      ATING["07 atingeri"]
      BUCLA["14 bucla"]
    end
    PANZA["&lt;canvas&gt;<br/>un singur element"]
    AUDIO["WebAudio<br/>oscilatoare + zgomot"]
  end

  IDX --> JS
  ATING -- "pointerdown" --> SCENE
  BUCLA -- "requestAnimationFrame" --> SCENE
  SCENE --> DESEN
  DESEN --> PANZA
  SCENE --> AUDIO
  TEMELIE --> SCENE
```

Nu există stat, nu există rutare, nu există date salvate. Tot ce știe jucăria
despre lume stă în câteva obiecte globale, iar la refresh se uită tot.

## Drumul jucătorului

O singură variabilă, `stare`, spune unde ești. Fiecare trecere e pornită de o
atingere, niciodată de un ceas — cu două excepții, marcate punctat: creșterea
punctului, care se termină singură, și întoarcerea din câmpie.

```mermaid
stateDiagram-v2
  direction LR
  [*] --> intuneric
  intuneric --> intuneric : atingere<br/>întoarce foaia (3 foi)
  intuneric --> crestere : balonul pocnește
  crestere --> balon : creșterea se termină
  balon --> transformare : atingi balonul
  transformare --> minge
  minge --> minge : sări, lași pete<br/>elefantul face curat
  minge --> muzeu : atingi elefantul
  muzeu --> galerie : atingi buzunarul GALERIE
  galerie --> campie : atingi rama
  campie --> foc : după cei zece pași,<br/>atingi ușa deschisă din tablou
  foc --> gheata : intri prin arsură
  gheata --> ulei : sari în vârtej
  ulei --> muzeu : cobori prin chepeng
  galerie --> muzeu : ieși din galerie
```

## Cum se naște un cadru

`cadru(t)` e singura funcție chemată de `requestAnimationFrame`. Ea nu desenează
nimic: alege scena, o lasă să-și mute lucrurile cu `dt`, apoi o pune să se
deseneze.

```mermaid
flowchart TB
  RAF["requestAnimationFrame"] --> CADRU["cadru(t)"]
  CADRU --> CALIT["reglezaCalitatea(t)<br/>scade fineţea dacă<br/>ultimul cadru a durat prea mult<br/>— și nu mai urcă la o treaptă<br/>care s-a înecat o dată"]
  CALIT --> MUZ["tineMuzicaMuzeului()<br/>programează nota următoare<br/>pe ceasul sunetului"]
  MUZ --> COMUTA{"stare"}
  COMUTA --> S1["scenele 1-2<br/>actualizează, apoi desenează"]
  COMUTA --> S3["scena 3"]
  COMUTA --> S4["scena 4"]
  COMUTA --> S5["scena 5"]
  COMUTA --> S6["scena 6"]
  COMUTA --> S7["scena 7"]
  COMUTA --> S8["scena 8"]
  S1 --> STAMP["ștampilele<br/>ce nu se schimbă<br/>se copiază, nu se repictează"]
  S3 --> STAMP
  S4 --> STAMP
  S5 --> STAMP
  S6 --> STAMP
  S7 --> STAMP
  S8 --> STAMP
  STAMP --> PANZA["&lt;canvas&gt;"]
  PANZA --> RAF
```

### Ștampilele

Cel mai scump lucru din jucărie e umplerea pixelilor, nu numărul de forme. De-aia
tot ce nu se schimbă de la un cadru la altul se pictează **o dată**, pe o pânză
ascunsă, și pe urmă se copiază.

| Ștampila | Unde | Ce ține |
|---|---|---|
| `stampilePlante` | scena 2 | fiecare soi și culoare de plantă |
| `stampileNori` | scenele 2-3 | norii vopsiți |
| `fundal3` | scena 3 | peisajul cu grădina din jurul custodelui |
| `salaGalerie` | scena 4 | interiorul rococo, întreg |
| `stampilaRamei` | scena 4 | rama aurită a miniaturii |
| `ramaMare` | scena 5 | rama aurită a pânzei uriașe |
| `tabloul` | scena 5 | pictura impresionistă |
| `compunerea`, `marunt` | scena 5 | pânze de lucru pentru pixelare |
| `salaFocului` | scena 6 | sala rotundă: tapetul, pasta de pe pereți, blana |
| `ramaFocului` | scena 6 | rama aurită a lucrării, culcată |
| `fundalTablou` | scena 6 | noaptea și dealurile din lucrare, puse în pastă |
| `salaGheata` | scena 7 | planurile cubiste, vectorii, podeaua, cristalele, fișa |
| `salaUlei` | scena 8 | sala neoclasică desenată în linie: pereții, vitrinele, podiumul, pelerina, trusa, cercul cromatic, fișa |
| `stratulDePictura` | scena 8 | **tot ce a pictat jucătorul** — nu se șterge niciodată |
| `panzaDiluata` | scena 8 | culoarea scursă prin chepeng, întinsă la trecerea spre scena următoare |

Fiecare ștampilă ține minte la ce mărime a fost pictată și se repictează când
pânza se schimbă. De-aia contează atât de mult ca pânza **să nu se schimbe
degeaba** — vezi capitolul următor.

## Măsurile: pixeli de pânză și pixeli de ecran

Nu desenăm pe ecran, ci pe o pânză plafonată la `PANZA_MAX` pixeli, întinsă pe
urmă cu CSS peste toată fereastra. Pe deasupra, `reglezaCalitatea` mai micșorează
pânza când cadrele întârzie. Deci **`W` și `H` nu sunt lățimea și înălțimea
ferestrei**, iar raportul dintre ele și fereastră (`scalaPanzei`) se schimbă în
timpul jocului.

De aici ies două feluri de greșeli, amândouă văzute pe pielea noastră:

| Greșeala | Cum arată | Leacul |
|---|---|---|
| O mărime scrisă în pixeli rotunzi (`470`, `20px`) | Pe pânză micșorată, lucrul se **umflă**: manualul sărea de la o treime la jumătate de ecran | `ecran(470)`, `scrisGeorgia(20)` |
| O socoteală ținută minte în pixeli de pânză | La schimbarea pânzei, lucrul **rămâne unde era**: cercelul zbura în dreapta ecranului, cu lănțișorul întins peste toată grădina | un ascultător în `laRedimensionare` |

```mermaid
flowchart TB
  FER["fereastra<br/>window.innerWidth × innerHeight"] --> SCALA["scalaPanzei<br/>= plafonul PANZA_MAX × calitate"]
  SCALA --> WH["W, H<br/>pixelii pe care desenăm"]
  SCALA --> ECRAN["ecran(n) = n × scalaPanzei<br/>scrisGeorgia(px)"]
  WH --> DESEN["desenul"]
  ECRAN --> DESEN
  SCALA -. "s-a schimbat" .-> ANUNT["laRedimensionare[]<br/>fiecare scenă își mută lucrurile"]
  ANUNT --> STARI["cursor · balon · minge · elefant<br/>pete · nori · cercel · lupă"]
  STARI --> DESEN
```

**Regula:** dacă o mărime nu iese din `W`/`H`, trebuie să iasă din `ecran()`. Dacă
o coordonată e ținută minte de la un cadru la altul, scena ei datorează un
ascultător în `laRedimensionare` — sau, mai bine, o ține în fracțiuni de ecran,
cum face grădina, și atunci nu datorează nimic.

### Regulatorul de calitate

`reglezaCalitatea` ține media alunecătoare a timpului dintre cadre și coboară o
treaptă când jocul se poticnește. Trei lucruri care nu se văd din cod la prima
citire, dar fără de care regulatorul face chiar el lagul pe care ar trebui să-l
vindece:

1. **Cadrul schimbării nu se măsoară.** Coborârea unei trepte repictează din
   temelii toate ștampilele scenei — e cel mai scump cadru din jucărie. Pus la
   socoteală, el singur spune „ne înecăm" și cheamă încă o coborâre, care
   repictează iar tot.
2. **Plafonul se închide după o urcare care nu s-a ținut.** Altfel jucăria urcă,
   se îneacă, coboară, urcă iar — la nesfârșit, cu o repictare completă la
   fiecare tur. O poticnire care vine la peste `RASPUNDEREA_URCARII` de la urcare
   e a scenei care s-a deschis între timp, nu a treptei, și nu închide nimic.
3. **Redimensionările ferestrei se adună.** Cât tragi de colț sosesc zeci pe
   secundă, și fiecare ar repicta tot; așteptăm să se oprească mâna.

### Pasta

Scena a șasea e despre valoarea petei picturale, așa că nu poate fi zugrăvită
neted: tema scrisă pe perete și dezmințită de perete. **Tot** ce se vede în ea e
pus din tușe, cu `pataDePasta` — peretele, pardoseala, rama, fondul lucrării,
focul din ea, flacăra care arde tapetul și funinginea de deasupra.

O pată de pastă e o urmă de cuțit, nu un bob de culoare. Are muchii drepte și
colțuri, un capăt gros (unde s-a lăsat lama) și unul rupt (unde s-a ridicat), o
creastă care prinde lumina pe o muchie lungă și o umbră pe cealaltă, plus
râcâiturile lăsate de lamă pe dinăuntru. Creasta și umbra se fac dintr-un singur
truc: același contur, mutat puțin, trasat cu linie groasă și tăiat la forma
petei — din tot conturul mutat rămâne numai dunga de pe muchia dinspre lumină.

Două lucruri decid dacă o suprafață se citește pictată:

| | Greșit | Bine |
|---|---|---|
| **Așezarea** | împrăștiate la sorți — se adună în ciorchini și lasă goluri, iar golurile sunt vopseaua de dedesubt | pe o **rețea cu zvâcnet**: o tușă pe ochi, mutată cu ceva mai puțin de un ochi, lungă cât doi. Se ating, deci acoperă |
| **Proporția** | groase cât late — ies pietre de caldarâm | de patru-cinci ori mai lungi decât late, ca urma unei lame |

Culoarea urmează regula expresionistă: **valoarea** urmează lumina — aprins în
mijloc, stins spre margini, altfel clarobscurul se pierde — dar **tonul sare** de
la o tușă la alta, în lăuntrul aceleiași trepte (`TONURI_APRINSE`,
`TONURI_CALDE`, `TONURI_ARSE`, `TONURI_ADANCI`).

Tot ce nu se mișcă stă pe ștampile: peretele, pardoseala și blana pe cea a sălii;
rama pe a ei; fondul lucrării pe `fundalTablou`. La fiecare cadru se repictează
numai focul, flacăra de pe perete și fumul.

### Cum arde peretele

Lanțul cauzal al scenei trebuie să se vadă, nu doar să se întâmple:

```mermaid
flowchart LR
  P["atingi pânza<br/>cu mănușile"] --> S["scânteia zboară<br/>spre peretele din dreapta"]
  S --> F["peretele ia foc<br/>la temelie"]
  F --> A["arsura urcă<br/>pragul rămâne pe loc"]
  F --> N["funinginea se strânge<br/>deasupra flăcării"]
  F --> M["fum în sală"]
  A --> U["ușa: cenușă rece<br/>margine de material ars"]
  N -.-> U
```

Scânteia zbura înainte, spre colțul de jos-dreapta al ecranului — adică spre
tine, în planul întâi — și pe urmă apărea o gaură în peretele din fund. Nimic din
ce sare în față n-are cum să ardă ceva din spate: ochiul vede traiectoria și
așteaptă focul acolo unde a căzut scânteia.

### Frigul, în deget

Scena a șaptea nu spune că e frig, îl face. Cursorul jocului rămâne al jocului —
o scenă n-are voie să strice unealta celorlalte — dar sala își ține **degetul ei**
(`s7.degetX/Y`), care aleargă după cursorul adevărat cu o iuțeală ce ține de cât
de cald e:

| Treaptă | Când | Ce se simte |
|---|---|---|
| `0.10` | ai atins lucrarea cu mâna goală | aproape nimic nu se mai poate face — asta e pedeapsa |
| `0.45` | frigul sălii, până pornești utilitatea | se umblă, dar trebuie împins |
| `1.00` | după funcția de utilitate | chiar lucrul pe care îl face un costum bun |

Sub `0.45` nu se coboară niciodată în afara înghețului: un cursor care nu ascultă
nu e o senzație, e o defecțiune.

Din îngheț nu se iese apăsând, ci **frecând**: fiecare schimbare de sens a mâinii
umple o bară. Frecarea se măsoară în ascultătorul de mișcare, pe mâna adevărată
(`frecareaScenei7`), nu pe degetul întârziat — cine scutură mouse-ul scutură
repede, iar degetul înghețat n-ar apuca niciodată să-l urmeze.

Aceeași figură se cere a doua oară la sfârșit, ca să se deschidă portalul. Prima
dată freci ca să scapi, a doua oară ca să spargi gheața de pe lucrare: din
aceeași mișcare iese întâi frica, pe urmă puterea.

### Cele trei funcții ale costumului

Sub costum stau trei forme, fiecare cu silueta ei — un **scut**, o **roată
dințată**, o **prismă**. Apeși pe una: în caseta din dreapta se scrie ce face
funcția aceea, iar pe costum se întâmplă altceva de fiecare dată.

```mermaid
flowchart LR
  SCUT["scut<br/>PROTECȚIE"] --> B["bariera geometrică<br/>mătură promoroaca"]
  ROATA["roată<br/>UTILITATE"] --> T["trezește liniile de forță"]
  T --> P["le legi în ordine"] --> M["degetul își recapătă viteza"]
  PRISMA["prismă<br/>ESTETICĂ"] --> C["cristalele de pe costum se aprind"]
  C --> R["reflexii tăiate pe pereți"]
```

Roata nu leagă ea liniile — le **trezește**. Fapta rămâne a jucătorului; a
mașinii e numai s-o facă cu putință. Iar bariera de la protecție se vede cum
curăță: bruma se desenează numai în afara ei, deci pleacă din locul prin care a
trecut linia.

Costumul e făcut din piese așezate cubist — fața, **spatele**, **latura** și un
petic de **căptușeală**, laolaltă, cum n-au cum să se vadă în realitate. E chiar
ce face un tipar de croitorie, care desface haina în fețe și mâneci și o întinde
pe masă: cubismul și croitoria descompun același lucru. La deschiderea portalului,
obiectul face singur ce a făcut pictorul cu el — se ia în bucăți și se recompune,
iar prin golul de la mijloc se vede drumul.

### Amprenta jucătorului

Sala a opta e singura din toată jucăria în care jucătorul nu se uită la o
lucrare, ci **face** una. De-aia sala vine **desenată numai în linie, complet
necolorată**: un desen de mână, o sală de muzeu neoclasică cu vitrine, podium și
o pelerină regală pe el. Colorată dinainte, n-ar mai fi rămas nimic de făcut în
ea — și tot mesajul sălii („spațiul este pânza ta") ar fi fost o vorbă goală.

Jucătorul are la îndemână două lucruri, sus în stânga: o **trusă de șase
ustensile** (pensulă rotundă, pensulă lată, pensulă de tuș, bidinea, cuțit
ascuțit, cuțit lat) și, sub ea, **cercul cromatic** cu douăsprezece raze. Alege
una și una, și pune pastă unde vrea. Ustensilele lasă urme cu adevărat diferite
— altfel alegerea lor ar fi fost un decor; cuțitele lasă lespezi, pensulele lasă
fire. Cercul e în ordinea roții, fiecare culoare între cele două din care se
face: cine se uită la el învață asta fără să-i spună nimeni.

Tot ce mânjește rămâne, iar asta cere o unealtă anume.

Tușele nu se țin într-o listă redesenată la fiecare cadru — după o sută s-ar
târî — ci pe o **pânză ascunsă** (`stratulDePictura`), peste care fiecare tușă
nouă se pune o singură dată. Pânza aia se copiază la fiecare cadru dintr-o
singură mișcare, oricâtă vopsea ar fi pe ea. E chiar felul în care lucrează un
pictor: nu-și repictează tabloul de la zero când adaugă o tușă.

La schimbarea pânzei, ce ai pictat se întinde pe măsura nouă. Pierdut, ar fi cea
mai urâtă pedeapsă din jucărie: singurul loc unde ai făcut ceva cu mâna ta s-ar
șterge fiindcă ai tras de colțul ferestrei.

Dâra continuă (mâna trasă cu butonul apăsat) se face din `pensuleazaScena8`,
chemată din ascultătorul de mișcare — la fel ca frecarea din sala de gheață.
Fără ea, „lasă-ți amprenta" ar fi însemnat o sută de clicuri, adică o corvoadă,
nu o libertate.

#### Croiala pelerinei, scrisă o singură dată

Poți picta oriunde în sală, dar numai **pelerina** deschide drumul mai departe:
acoperită de tot, sub ea se deschide un chepeng, culoarea se scurge acolo, și pe
acolo se intră în scena următoare. (Dacă s-ar fi socotit toată sala, ai fi
deschis chepengul mâzgălind un colț de perete.)

Deci două lucruri trebuie să spună același adevăr: **conturul desenat** și
**socoteala acoperirii**. Amândouă ies din același tabel, `PROFIL_PELERINEI` —
pentru fiecare înălțime, cât e de lată — citit cu `latimeaPelerinei(v)`. Scrise
de două ori, s-ar fi despărțit la prima schimbare: ai fi colorat o pelerină și
ai fi acoperit alta.

Prima variantă socotea acoperirea altfel: desena conturul pe o pânză de lucru și
citea pixelii din ea cu `getImageData`. Corect, dar e cel mai scump lucru pe care
i-l poți cere unei pânze — și, mai rău, cu totul de neîncercat, fiindcă pânza
prefăcută din teste n-are de unde să citească pixeli. Acum e o înmulțire.

Cifrele tabelului spun, de sus în jos: guler îngust, **umerii — cel mai lat lucru
de sus**, o strângere la talie, și abia pe urmă trena revărsată pe podium.
Strângerea aia e tot ce deosebește o mantie de un abajur: un contur care se
lățește de sus până jos fără să se oprească nicăieri se citește ca un clopot,
oricâte broderii i-ai pune pe el. Din același tabel ies și cutele stofei, ca să
se string și ele unde se strânge materialul.

### Impasto: ce am învățat despre pastă

Aceeași unealtă (`pataDePasta`) desenează sala focului și sala uleiului, dar
regulile ei au fost învățate greu, o greșeală pe rând:

| Ce credeam | Ce e de fapt |
|---|---|
| tușe transparente, ca să se vadă suportul | **opace** — o tușă de impasto acoperă tot ce e sub ea; transparente, ies o glazură, adică tehnica opusă |
| lungi și subțiri, ca urma unei lame | **de vreo doi la unu** — la șapte la unu se ascut în sulițe |
| așezate la sorți | pe o **rețea mai deasă decât sunt ele de mari**, deci se calcă una pe alta: din asta iese relieful |
| culoarea trasă la sorți pentru fiecare | **pe zone** — pe o paletă pe care s-a lucrat, culorile stau în insule; la sorți ies boabe de porumb |
| toate de-o mărime | **mărimea sare mult** — toate la fel e un model de tapet, oricât de gros |

Iar suportul trebuie să se vadă: pasta stă în ostroave groase, și între ele se
zărește ce e dedesubt. Acoperit peste tot, suportul dispare cu totul — și atunci
nu mai e o suprafață pictată, ci un covor de vopsea.

### Apa duce pigmentul (sala a noua)

Sala a opta și sala a noua sunt două fețe ale aceleiași întrebări: cât din
lucrare e al tău? În ulei, pasta rămâne fix unde ai lăsat-o — tu conduci. În
acuarelă nu se pictează nimic: pe perete stă o foaie cu un desen grafic uscat,
iar jucătorul are în mână un pulverizator. Dă apă; desenul se face singur.

Toată sala stă pe o grilă de udare de 22×22 de ochiuri peste foaie
(`s9.celule`). Fiecare stropire udă un cerc de ochiuri, iar `raspandesteApa()`
mută apa între vecini la fiecare cadru — **fără să se piardă nimic pe drum**, plus
un curent în jos, că foaia stă pe perete. Desenul se citește din grilă: fiecare
linie și fiecare punct își ia grosimea și puterea din câtă apă e sub ele, așa că
laviul crește **dinspre mâna jucătorului**, nu deodată peste tot.

Trei lucruri fac ca o pată să pară acuarelă, și niciunul nu e culoarea:
marginea strâmbă (`conturDeApa`, trei sinusuri cu perioade care nu se împart una
la alta), **marginea mai apăsată decât mijlocul** — pigmentul împins de apă când
balta se usucă, fix pe dos față de creasta de impasto din ulei — și granulația
din adânciturile hârtiei. Singurul lucru fără dungă închisă e soarele: lucrul cel
mai luminos din tablou nu poate avea marginea mai întunecată decât mijlocul.

Laviul întreg costă vreo trei mii de operații de desen, iar când podeaua se face
oglindă s-ar desena de două ori pe cadru. De-aia stă pe o ștampilă
(`panzaLucrarii`), refăcută numai când s-a mișcat apa și cel mult de zece ori pe
secundă; oglindirea din podea folosește **aceeași pânză**, întoarsă. Așa un cadru
al sălii coboară de la vreo trei mii de operații la treizeci și cinci câtă vreme
foaia stă uscată și la vreo opt sute când sala e inundată.

În sala a opta suportul e chiar **desenul în linie**: hârtia albă și conturul de
creion se văd printre tușe, și fiecare pată spune, prin ce acoperă, cât ai lucrat
acolo. (Sala avusese înainte pereți de pânză de sac, făcuți dintr-o plăcuță de
urzeală și bătătură repetată cu `createPattern`. Au căzut odată cu sala colorată:
o textură desenată dinainte e tot o hotărâre luată în locul jucătorului. Lecția
care rămâne din ea e că o țesătură se face din fire care trec **unul peste
altul**, ca la tabla de șah, nu din două rânduri de dungi suprapuse — de acolo
vine sclipirea măruntă care se citește din prima ca „țesut".)

## Ce ține fiecare fișier

Ordinea contează: fiecare fișier se sprijină pe cele dinaintea lui. Dacă muți
unul mai sus, ceva de dedesubt rămâne fără pământ.

```mermaid
flowchart TB
  subgraph T["Temelia"]
    A1["01-panza.js · 148<br/>pânza, măsurile, regulatorul de calitate"]
    A2["02-cursor.js · 69<br/>cursorul și viteza degetului"]
    A3["03-sunete.js · 911<br/>toate sunetele + muzica"]
    A4["04-stari.js · 25<br/>variabila stare"]
  end
  subgraph S["Scenele"]
    B5["05-scena1-balon.js · 172"]
    B6["06-scena2-minge.js · 919<br/>mingea, petele, elefantul, grădina"]
    B11["11-scena3-muzeu.js · 1805<br/>custodele, haina, buzunarul, manualul"]
    B12["12-scena4-galerie.js · 1438<br/>sala rococo, rama, lupa"]
    B13["13-scena5-campie.js · 1905<br/>pânza uriașă, țăranii, pantofii"]
    B15["15-scena6-foc.js · 1993<br/>sala rotundă, șevaletul, pasta, arsura"]
    B16["16-scena7-gheata.js · 2133<br/>sala de gheață, costumul, portalul"]
    B17["17-scena8-ulei.js · 2820<br/>sala în linie, trusa, cercul cromatic, postamentul"]
    B18["18-scena9-acuarela.js · 1439<br/>foaia, pulverizatorul, laviul, lacul-oglindă"]
  end
  subgraph D["Desenul și legăturile"]
    C7["07-atingeri.js · 155<br/>ce face fiecare atingere"]
    C8["08-desen-fundal.js · 292<br/>fundalurile, foile deschiderii"]
    C9["09-manuta-balon.js · 317<br/>mănușa-balon și cioburile"]
    C10["10-desen-scene-1-2.js · 681"]
    C14["14-bucla.js · 187<br/>un cadru, la nesfârșit"]
  end
  T --> S
  T --> D
  S --> D
```

## Testele

`teste.html` nu copiază codul jucăriei. Citește `index.html`, ia de acolo lista
fișierelor **în ordinea în care le încarcă pagina**, le adună și le rulează cu o
pânză falsă care ține minte fiecare desen. Așa lista are un singur stăpân: un
fișier nou e luat de la sine, și nu se poate întâmpla ca pagina să ruleze un cod
și testele altul.

```mermaid
flowchart LR
  T["teste.html"] -- "fetch" --> IDX["index.html"]
  IDX -- "lista &lt;script src&gt;" --> T
  T -- "fetch fiecare" --> JS["js/*.js"]
  JS --> FAB["new Function(...)<br/>o jucărie izolată per test"]
  FAB --> FALS["pânză falsă<br/>ține minte forme, culori,<br/>gradiente, text, imagini"]
  FAB --> CEAS["ceas fals<br/>timpul se împinge înainte"]
  FALS --> INTREB["întrebări:<br/>câte forme? ce scrie?<br/>ce culoare? câte operații?"]
```

Se lucrează cu testul scris întâi. Când un test vechi se ceartă cu o cerere nouă,
testul se rescrie ca să apere intenția care a rămas valabilă — niciodată slăbit
în tăcere.

## Fazele

Primele nouă au adus scenele. De la zece în sus n-a mai apărut nicio scenă nouă:
s-a dres ce nu mergea.

```mermaid
flowchart LR
  subgraph CONSTRUIT["Construit — fazele 0-9"]
    direction TB
    F0["0 · scheletul"] --> F1["1 · punctul și balonul"]
    F1 --> F2["2 · mingea și elefantul"]
    F2 --> F3["3 · plante și nori"]
    F3 --> F4["4 · muzeul e elefantul"]
    F4 --> F5["5 · manual, diplomă, cercel"]
    F5 --> F6["6 · galeria cu lupa"]
    F6 --> F7["7 · rama aurită"]
    F7 --> F8["8 · pânza și cei zece pași"]
    F8 --> F9["9 · deschiderea cu trei foi"]
  end
  subgraph DRES["Dres — fazele 10-20"]
    direction TB
    F10["10 · lagul"] --> F11["11 · mingea"]
    F11 --> F12["12 · mânuța-balon"]
    F12 --> F13["13 · nimeni blocat în galerie"]
    F13 --> F14["14 · norii se fac la atingere"]
    F14 --> F15["15 · ramă, pantofi, port"]
    F15 --> F16["16 · țăranii calcă"]
    F16 --> F17["17 · Mozart, liniște, nouă îndreptări"]
    F17 --> F18["18 · un buzunar, fișe de sală, pocnetul"]
    F18 --> F19["19 · măsurile pânzei"]
    F19 --> F20["20 · sala focului, pusă în pastă"]
  end
  CONSTRUIT ==> DRES
```

Fiecare fază are, în [PLAN.md](PLAN.md), ce s-a stricat și de ce — partea cea mai
folositoare din tot ce e scris aici.

## Ce trebuie făcut în continuare

```mermaid
flowchart TB
  subgraph ACUM["De pus mâna acum"]
    direction TB
    N1["Pridvorul casei<br/>e văzut din față, plat<br/>scena 5, casa cu pridvor"]
    N2["La zece pași rămâne<br/>prea mult perete gol<br/>poate nu trebuie atât de mic"]
    N3["Fișa din galerie:<br/>lupa trece peste colțul ei<br/>de mutat în stânga?"]
    N4["Fonturile scenelor 4-6:<br/>lățimile de încadrare<br/>încă sunt cifre rotunde"]
    N5["Fișa de sală, pe ecran<br/>înalt și îngust, se face<br/>o coloană de un cuvânt"]
  end
  subgraph APOI["De cântărit"]
    direction TB
    M1["Unde s-a tăiat codul<br/>în cele 14 fișiere:<br/>merge, dar n-a cântărit nimeni"]
    M2["Sunetul, ascultat de om:<br/>testele spun că e acolo,<br/>nu și cum sună"]
    M3["Pe telefon, cu degetul<br/>— nu s-a încercat niciodată"]
  end
  subgraph NICIODATA["Rămâne pe dinafară — deliberat"]
    direction TB
    X1["Scor, niveluri, victorie"]
    X2["Meniuri, setări, salvare"]
    X3["Taste"]
    X4["Text de prisos:<br/>ce se poate arăta nu se scrie"]
  end
  ACUM ==> APOI
```

## Reguli care nu se calcă

1. **Niciun fișier extern.** Tot desenul și tot sunetul se nasc în cod.
2. **Se deschide de pe disc**, cu dublu-clic. De-aia `js/` sunt scripturi
   obișnuite, nu module: modulele nu se încarcă de pe `file://`.
3. **Tot ce ține de timp trece prin `dt`.** Nimic nu depinde de câte cadre pe
   secundă merge ecranul.
4. **Ce se pictează o dată se ștampilează.** Un desen care nu se schimbă de la un
   cadru la altul n-are ce căuta în buclă.
5. **Nimeni nu rămâne blocat.** Orice loc unde trebuie făcut ceva anume are un
   semn care cheamă, și semnul se întărește cu cât treci mai mult fără să
   reușești.
6. **Cod și comentarii în română.** Numele lucrurilor din poveste sunt numele lor
   din cod.
7. **Comentariile spun de ce, nu ce.** Ce face o linie se vede din ea; comentariul
   spune ce s-a stricat când era altfel.
8. **Nicio măsură în pixeli rotunzi.** Ce nu iese din `W`/`H` iese din `ecran()`.
   Ce e ținut minte de la un cadru la altul, sau se ține în fracțiuni de ecran,
   sau își pune un ascultător în `laRedimensionare`.
