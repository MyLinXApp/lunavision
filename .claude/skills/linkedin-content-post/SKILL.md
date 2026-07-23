---
name: linkedin-content-post
description: >
  Erstellt einen kompletten LinkedIn-Post für LunaVision zu einem gewählten
  Trend-Thema: Post-Text (Caption) UND passende Grafik zusammen als ein
  Paket. Immer nutzen, wenn Marco ein Thema für einen LinkedIn-Post nennt
  oder um einen "Post", "Content", "Sharepic" oder "Grafik zum Thema X"
  bittet — auch wenn er nur das Thema nennt, ohne explizit "Text und Bild"
  zu sagen. Gibt niemals nur ein Bild ohne Text und nie nur Text ohne Bild
  aus, außer der Nutzer verlangt das ausdrücklich.
compatibility: Nutzt das bestehende Bild-Plugin (create_asset-Logik) dieses Repos
---

# LinkedIn Content Post (Text + Bild)

Erzeugt zu einem Thema IMMER zwei zusammengehörige Ergebnisse:
1. Eine vollständige, postfertige **Caption** (der eigentliche LinkedIn-Text)
2. Eine passende **Grafik** im LunaVision-Stil

Diese zwei Teile werden nie getrennt ausgegeben. Am Ende bekommt Marco
beides zusammen: Caption-Text zum Copy-Paste + Bildpfad.

## Ablauf

### Schritt 1 — Thema klären
Wenn Marco kein Thema nennt, kurz nachfragen oder (falls verfügbar) 2–3
aktuelle Trendthemen aus der Nische (KI/Automatisierung für lokale
Unternehmen & Handwerk, Rhein-Neckar-Region) vorschlagen und ihn wählen
lassen. Sobald ein Thema feststeht, weiter zu Schritt 2.

### Schritt 2 — Caption schreiben (zuerst, nicht zuletzt)
Schreibe zuerst den vollständigen Post-Text. Das ist der wichtigste Teil —
das Bild ist nur der visuelle Aufhänger.

Aufbau der Caption:
- **Hook** (1–2 Zeilen): konkret, persönlich, macht neugierig — kein
  Marketing-Sprech
- **Kern** (2–4 Zeilen): die eigentliche Aussage/Erkenntnis zum Thema,
  greifbar statt abstrakt
- **Bezug zu LunaVision/Marco** (1–2 Zeilen): was das für den Leser
  (lokales Unternehmen/Handwerksbetrieb) konkret bedeutet
- **CTA** (1 Zeile): direkte, unaufdringliche Handlungsaufforderung
  (z. B. "Schreib mir", "Sag mir, wo bei dir XY steht")

Tonalität (siehe `assets/brand-tokens.md`):
- Direkt, kompetent, bodenständig
- Du-Ansprache (LinkedIn zählt wie Instagram/WhatsApp)
- Keine Buzzwords: innovativ, ganzheitlich, maßgeschneidert, revolutionär,
  state-of-the-art, nachhaltig (ohne Beleg), kundenorientiert,
  Rundum-sorglos, Premium-Lösung, digitale Transformation
- Kurze Sätze, echte Beispiele statt Floskeln

### Schritt 2b — Service zuordnen (immer, 100% lunavision.org-gebrandet)
Ordne das Thema automatisch einem der echten LunaVision-Services zu und
baue den CTA konkret darauf auf — nie generisch bleiben:

| Thema-Cluster | Service | CTA-Ziel |
|---|---|---|
| KI-Agenten, Content-Automatisierung, Ad-Copy/Personas/Social-Kalender | **KI-Content-Agent** | "Schreib mir, wenn du sowas für dein Business willst" → WhatsApp |
| Website, Online-Sichtbarkeit für Handwerk/KMU | **Landingpage** (599€, 48h online) | WhatsApp-CTA: `https://wa.me/491742555178` |
| KI-Suche, ChatGPT/Perplexity-Sichtbarkeit, "Google reicht nicht mehr" | **GEO** (Generative Engine Optimization) | Sichtbarkeits-Check anbieten |
| Rechnungen, Belege, Buchhaltungs-Chaos | **Rechnungsautomatisierung** | "Ich zeig dir, wie das bei dir aussehen würde" |
| Google-Bewertungen, Reputation | **WhatsApp Bewertungsbooster** (29€/mtl.) | WhatsApp-CTA |

CTA-Format: WhatsApp-Link `https://wa.me/491742555178?text=...` (mit
kurzem, zum Thema passendem vorausgefülltem Text) statt Website-Link im
Post-Text selbst — LinkedIn drosselt Reichweite bei externen Links im
Haupttext. Website (lunavision.org) höchstens im ersten Kommentar oder als
"mehr dazu: Link in Bio" erwähnen, nie im Post-Text selbst verlinken.

Alle Preise/Konditionen exakt wie auf lunavision.org: Landingpage 599€
Projektpreis (48h), monatliche Services alle monatlich kündbar ohne
Mindestlaufzeit — diese Fakten nie abweichend formulieren.

### Schritt 3 — Bild-Headline ableiten
Aus der Caption (nicht aus dem Rohthema) eine kurze Bild-Headline ableiten:
2–3 kurze Zeilen, die die Kernaussage der Caption verdichten. Das ist NICHT
die Caption selbst, sondern ein knapper visueller Verstärker dazu.

### Schritt 4 — Bildkonzept ableiten
Leite aus dem Thema eine **eigenständige Szene** ab (Ort, Pose, visuelles
Motiv). Nutze `assets/referenzbild.png` NUR für Gesicht/Person — nie als
feste Kulisse. Szene, Hintergrund und Komposition müssen sich je nach
Thema unterscheiden (schon erprobt: Dachterrasse/Sonnenuntergang für
"KI-Content-Agent"-Thema, dunkles Büro mit Workflow-Screens für
"Agentic AI"-Thema — neue Themen bekommen neue, passende Szenen).

Farben/Look: Navy-Gradient #0B0F1C, Gold-Akzente #C7A75A (siehe
`assets/brand-tokens.md`).

### Schritt 5 — Bild generieren
Rufe `scripts/generate_post_image.js` mit der Headline (aus Schritt 3) und
der Szenenbeschreibung (aus Schritt 4) auf — gleiche Logik wie `create_asset`.
Das Skript setzt den kompletten LunaVision-Look (Navy-Gradient, Gold, Palette,
Gesicht-nur-aus-Referenz) selbst zusammen; du lieferst nur Szene + Textzeilen.

Voraussetzung: `GEMINI_API_KEY` ist in der Umgebung gesetzt. Aufruf vom
Projekt-Root aus, Ergebnis nach `assets/<thema-slug>.png` speichern:

```bash
node .claude/skills/linkedin-content-post/scripts/generate_post_image.js \
  --output "assets/<thema-slug>.png" \
  --reference ".claude/skills/linkedin-content-post/assets/referenzbild.png" \
  --scene "<eigenständige Szenenbeschreibung aus Schritt 4>" \
  --line1 "<Headline-Zeile 1>" \
  --line2 "<Headline-Zeile 2>" \
  --line3 "<optionale Zeile 3>" \
  --subline "<optionale Subline>" \
  --gold "2,3"
```

`--gold` bestimmt, welche Headline-Zeilen in Gold gesetzt werden (Rest weiß).
`--line3` und `--subline` sind optional. Das Skript gibt bei Erfolg JSON mit
`filePath` aus und schreibt das Bild direkt an `--output` — es entsteht keine
Zweitkopie, nichts aufzuräumen.

### Schritt 6 — Output
Gib IMMER beides gemeinsam aus:
1. Die vollständige Caption als Text zum Copy-Paste
2. Den Pfad zur generierten Grafik (`assets/<thema-slug>.png`)

Nie nur eines von beidem, außer Marco fragt ausdrücklich nur nach Text
oder nur nach Bild.

## Bundled Resources
- `assets/referenzbild.png` — Referenzfoto (nur Gesicht/Person verwenden)
- `assets/brand-tokens.md` — Farben, Fonts, Tonalität, verbotene Wörter
- `scripts/generate_post_image.js` — bestehendes, funktionierendes
  Bild-Generierungs-Skript (create_asset-Logik)
