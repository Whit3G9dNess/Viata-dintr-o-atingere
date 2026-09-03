# Viața dintr-o atingere

O jucărie digitală care se desenează singură. Nu are nicio imagine și niciun
sunet luat de undeva: tot ce se vede și tot ce se aude e scos din cod, linie cu
linie. Cinci scene, legate una de alta prin atingeri.

## Cum o pornești

**Cel mai simplu:** dublu-clic pe `index.html`. Se deschide în browser și merge,
fără niciun server. De-aia fișierele din `js/` sunt scripturi obișnuite, nu
module — modulele nu se încarcă de pe disc.

**Cu server** (îți trebuie pentru teste). Pornește **serverul de casă**, din
folderul de deasupra — cel în care stă `server.py`:

```bash
python server.py
```

apoi deschizi `http://localhost:8765/Viata-dintr-o-atingere/Viata-dintr-o-atingere/index.html`.

Serverul ăsta face două lucruri pe care `python -m http.server` nu le face, și
amândouă contează când lucrezi la joc:

1. **Nu lasă browserul să țină minte nimic.** Cu serverul obișnuit, fișierele din
   `js/` rămân în memoria browserului, iar un refresh îți poate da codul de acum
   zece minute — pagina arată neschimbată și crezi că nu s-a lucrat nimic. E cea
   mai înșelătoare pierdere de vreme cu putință, fiindcă nimic nu pare stricat.
2. **Spune paginii când s-a schimbat un fișier**, prin `/__ceas` — un singur
   număr, data celei mai proaspete modificări. Pagina îl întreabă din două în
   două secunde, și atunci:
   - **jocul** arată un semn mic în colțul din stânga jos: *s-a schimbat ceva ·
     reîncarcă*. Clic pe el și pagina se reîncarcă. Nu se reîncarcă singur
     dinadins: jocul n-are salvare, iar o reîncărcare venită peste tine în sala a
     opta ți-ar șterge tot drumul până acolo.
   - **testele** se reîncarcă singure și rulează din nou. Acolo n-ai ce pierde,
     iar fereastra arată în permanență starea adevărată a suitei.

De pe `file://` nu există server, întrebarea eșuează în tăcere și nu se întâmplă
nimic — jocul merge mai departe cu dublu-clic, ca înainte.

## Cum rulezi testele

Cu serverul pornit, deschizi
`http://localhost:8765/Viata-dintr-o-atingere/Viata-dintr-o-atingere/teste.html`.
Testele se rulează singure și scriu sus câte au trecut și câte au căzut.

Nu copiază codul: îl citesc din fișierele pe care le încarcă `index.html`, în
aceeași ordine, și îl pun într-o pânză falsă care ține minte fiecare desen. Așa
un test poate să întrebe „câte forme s-au desenat aici" sau „ce scrie pe ecran".

## Unde scrie ce

| Fișier | Ce ține |
| --- | --- |
| [SPEC.md](SPEC.md) | Ce e jucăria și cum arată fiecare scenă |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Cum e construită pe dinăuntru, cu diagrame |
| [PLAN.md](PLAN.md) | Cum s-a construit, fază cu fază, și ce s-a stricat pe drum |

## Ce e în fiecare fișier

| Fișier | Ce ține |
| --- | --- |
| `js/01-panza.js` | Pânza, măsurile ei și uneltele mărunte de desen |
| `js/02-cursor.js` | Cursorul și algoritmul cinetic |
| `js/03-sunete.js` | Toate sunetele, scoase din cod |
| `js/04-stari.js` | Stările poveștii |
| `js/05-scena1-balon.js` | Scena 1 — punctul și balonul de săpun |
| `js/06-scena2-minge.js` | Scena 2 — mingea, elefantul, petele, grădina |
| `js/07-atingeri.js` | Ce se întâmplă la fiecare atingere |
| `js/08-desen-fundal.js` | Fundalurile și desenul de bază |
| `js/09-manuta-balon.js` | Mânuța-balon din pagina a treia a deschiderii |
| `js/10-desen-scene-1-2.js` | Invitația și desenul scenelor 1 și 2 |
| `js/11-scena3-muzeu.js` | Scena 3 — muzeul secret din haina elefantului |
| `js/12-scena4-galerie.js` | Scena 4 — galeria rococo cu miniatura și lupa |
| `js/13-scena5-campie.js` | Scena 5 — pânza uriașă și cei zece pași înapoi |
| `js/14-bucla.js` | Bucla de animație: un cadru, la nesfârșit |

Ordinea din tabel e chiar ordinea în care `index.html` le încarcă, și ea
contează: fiecare fișier se sprijină pe cele dinaintea lui. Dacă muți unul mai
sus, ceva de dedesubt rămâne fără pământ.

## Drumul prin jucărie

1. **Deschiderea** — trei foi pe negru: titlul, ce fel de lucru e, și mânuța care
   te cheamă să atingi. Fiecare atingere întoarce o foaie.
2. **Scena 1** — dintr-un punct crește un balon de săpun.
3. **Scena 2** — balonul se face minge. Mingea sare și lasă pete de culoare. Vine
   un elefant și le soarbe: din fiecare culoare iese un balon. Cele care coboară
   se fac plante, singure. Cele care urcă plutesc pe cer și se fac nori numai
   când le atingi tu.
4. **Scena 3** — elefantul se așază și își deschide haina: e un muzeu. Buzunarele
   lui sunt galerii, cercelul din ureche e soneria.
5. **Scena 4** — o sală rococo cu o ramă aurită și o miniatură neagră. Iei lupa de
   pe consolă și cauți.
6. **Scena 5** — o pânză uriașă, pixelată. Pe podea, o pereche de pantofi și o
   poruncă: fă zece pași în spate. Cu fiecare pas se limpezește.

## De ce e scris așa

Comentariile din cod nu spun ce face o linie — asta se vede din ea. Spun de ce e
făcută așa și ce s-a stricat când era altfel. Sunt însemnările cuiva care a
încercat și celălalt fel.
