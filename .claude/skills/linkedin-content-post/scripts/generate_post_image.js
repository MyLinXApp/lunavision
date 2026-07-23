#!/usr/bin/env node
/**
 * generate_post_image.js
 *
 * Erzeugt eine LunaVision-LinkedIn-Grafik im festen Marken-Look
 * (Navy-Gradient #0B0F1C, Gold-Akzente #C7A75A, weißer Text) auf Basis
 * einer Headline + einer frei ableitbaren Szenenbeschreibung.
 *
 * Nutzt die bestehende create_asset-Logik des media-pipeline Bild-Plugins
 * (Google Gemini). Das Referenzfoto wird NUR fuer Gesicht/Person verwendet –
 * Szene, Pose und Hintergrund kommen ausschliesslich aus --scene.
 *
 * Voraussetzung: Umgebungsvariable GEMINI_API_KEY ist gesetzt (z. B. in
 * ~/.zshrc) und das media-pipeline-Plugin ist installiert inkl. node_modules.
 *
 * Beispiel:
 *   node generate_post_image.js \
 *     --output "assets/agentic-ai.png" \
 *     --reference "assets/referenzbild.png" \
 *     --scene "dunkles High-End-Buero bei Nacht, mehrere Monitore mit Workflow-Diagrammen und Code" \
 *     --line1 "AUFGABE VERGEBEN." \
 *     --line2 "AGENT UEBERNIMMT." \
 *     --line3 "SELBSTSTAENDIG." \
 *     --subline "SO BAUT LUNAVISION EUCH ECHTE KI-AGENTEN" \
 *     --gold "2,3"
 *
 * --gold gibt an, welche Headline-Zeilen in Gold (#C7A75A) gesetzt werden
 * (Rest weiss). Standard: "2,3". --line3 ist optional.
 */

import { parseArgs } from "node:util";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { pathToFileURL } from "node:url";

// --- Marken-Konstanten (siehe assets/brand-tokens.md) -----------------------
const NAVY = "#0B0F1C";
const GOLD = "#C7A75A";
const WHITE = "#FFFFFF";

/**
 * Findet das installierte media-pipeline-Plugin und gibt den mcp-server-Pfad
 * mit der hoechsten Versionsnummer zurueck.
 */
function locatePluginServerDir() {
  const base = path.join(
    os.homedir(),
    ".claude/plugins/cache/media-pipeline-marketplace/media-pipeline"
  );
  if (!fs.existsSync(base)) {
    throw new Error(
      `media-pipeline-Plugin nicht gefunden unter ${base}. ` +
        `Ist das Bild-Plugin installiert?`
    );
  }
  const versions = fs
    .readdirSync(base, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));

  for (const v of versions) {
    const serverDir = path.join(base, v, "mcp-server");
    if (fs.existsSync(path.join(serverDir, "build/media-pipeline-service.js"))) {
      return serverDir;
    }
  }
  throw new Error(
    `Kein gebauter mcp-server (build/media-pipeline-service.js) im Plugin gefunden. ` +
      `Ggf. im Plugin-Ordner 'npm install' ausfuehren.`
  );
}

/**
 * Baut den vollstaendigen, marken-konsistenten Bild-Prompt aus Szene +
 * Headline. Die gesamte LunaVision-Styling-Vorgabe steckt hier, damit der
 * Aufrufer nur Szene und Textzeilen liefern muss.
 */
function buildPrompt({ scene, lines, goldLines, subline }) {
  const headlineSpec = lines
    .map((text, i) => {
      const n = i + 1;
      const isGold = goldLines.includes(n);
      const color = isGold
        ? `gold (${GOLD}) mit weichem Gold-Glow`
        : `weiss (${WHITE})`;
      return `Zeile ${n} in ${color}: "${text}"`;
    })
    .join("\n");

  return `Erstelle eine hochwertige, editoriale Corporate-Grafik fuer LinkedIn/Instagram im 1:1-Quadrat, fotorealistischer Fotografie-Stil (absolut keine Illustration, kein Cartoon-Rendering).

WICHTIG — nutze das beigefuegte Referenzfoto AUSSCHLIESSLICH als Vorlage fuer Gesicht und Identitaet der Person: derselbe Mann, gleiche Gesichtszuege, gleiche kurze dunkle Haare und leichter Stoppelbart, fotorealistisch und wiedererkennbar. Uebernimm NICHT die Pose, Kleidungskulisse, den Hintergrund oder die Szene des Referenzfotos — entwirf eine komplett neue Szene und Komposition aus der folgenden Beschreibung.

Szene / Setting: ${scene}

Der Mann traegt ein hochwertiges dunkles Hemd und wirkt ruhig, kompetent und souveraen. Cinematografisches Licht in tiefem Navy (${NAVY}) mit warmen Gold-Akzenten (${GOLD}) auf Kanten und Details. Bodenstaendig und professionell, kein Sci-Fi-Neon.

Komponiere so, dass die obere linke Bildhaelfte dunkler fuer Text ist. Lege einen subtilen dunklen Navy-Verlauf (${NAVY}, nach transparent auslaufend) ueber die obere linke Region fuer Text-Lesbarkeit, ohne das Gesicht des Mannes abzudunkeln.

In dieser oberen linken dunklen Zone platziere eine fette Grossbuchstaben-Sans-Serif-Headline, gestapelt auf ${lines.length} kurze Zeilen:
${headlineSpec}

Fuege direkt unter dem Headline-Block eine duenne Gold-Akzentlinie (${GOLD}) ein.${
    subline
      ? `\n\nUnter der Linie eine kleinere Zeile in weiss (${WHITE}): "${subline}".`
      : ""
  }

Typografie scharf, gut lesbar, hoher Kontrast und korrekt in Deutsch geschrieben inkl. Umlauten. Keine Logos oder Wortmarken. Nutze ausschliesslich die Palette Navy (${NAVY}), Gold (${GOLD}) und Weiss (${WHITE}) — kein Lila, Pink, Neon-Gruen oder Pastell.`;
}

async function main() {
  const { values } = parseArgs({
    options: {
      output: { type: "string", short: "o" },
      reference: { type: "string", short: "r" },
      scene: { type: "string", short: "s" },
      line1: { type: "string" },
      line2: { type: "string" },
      line3: { type: "string" },
      subline: { type: "string" },
      gold: { type: "string", default: "2,3" },
      "aspect-ratio": { type: "string", short: "a", default: "1:1" },
      model: { type: "string", short: "m" },
      help: { type: "boolean", short: "h", default: false },
    },
    strict: true,
  });

  if (values.help) {
    console.log(
      "Usage: node generate_post_image.js --output <path> --reference <img> --scene <text> --line1 <t> --line2 <t> [--line3 <t>] [--subline <t>] [--gold 2,3] [--aspect-ratio 1:1] [--model <name>]"
    );
    process.exit(0);
  }

  const missing = [];
  if (!values.output) missing.push("--output");
  if (!values.reference) missing.push("--reference");
  if (!values.scene) missing.push("--scene");
  if (!values.line1) missing.push("--line1");
  if (!values.line2) missing.push("--line2");
  if (missing.length > 0) {
    console.error(`Fehlende Pflichtargumente: ${missing.join(", ")}`);
    process.exit(1);
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error(
      "GEMINI_API_KEY ist nicht gesetzt. Bitte in der Umgebung (z. B. ~/.zshrc) hinterlegen."
    );
    process.exit(1);
  }

  const referencePath = path.resolve(values.reference);
  if (!fs.existsSync(referencePath)) {
    console.error(`Referenzbild nicht gefunden: ${referencePath}`);
    process.exit(1);
  }

  const lines = [values.line1, values.line2, values.line3].filter(Boolean);
  const goldLines = values.gold
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => Number.isInteger(n));

  const prompt = buildPrompt({
    scene: values.scene,
    lines,
    goldLines,
    subline: values.subline,
  });

  // create_asset-Logik des Plugins laden (dynamisch, versionsunabhaengig)
  const serverDir = locatePluginServerDir();
  const serviceUrl = pathToFileURL(
    path.join(serverDir, "build/media-pipeline-service.js")
  ).href;
  const runtimeUrl = pathToFileURL(
    path.join(serverDir, "build/runtime.js")
  ).href;

  const { MediaPipelineService } = await import(serviceUrl);
  const { createLogger, createRuntimeConfig } = await import(runtimeUrl);

  const runtimeConfig = createRuntimeConfig(process.env);
  const logger = createLogger("linkedin-content-post", "warn");
  const service = new MediaPipelineService(runtimeConfig, logger);

  const result = await service.createAsset({
    prompt,
    referenceImages: [referencePath],
    aspectRatio: values["aspect-ratio"],
    model: values.model,
    outputPath: path.resolve(values.output),
  });

  console.log(
    JSON.stringify(
      {
        success: result.success,
        filePath: result.filePath,
        model: result.model,
        error: result.error,
      },
      null,
      2
    )
  );

  process.exit(result.success ? 0 : 1);
}

main().catch((err) => {
  console.error(`Fehler: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
