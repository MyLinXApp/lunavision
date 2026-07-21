// Cloudflare Pages Function: /api/submit
// Nimmt Einreichungen aus den Website-Tools (GEO-Check, ROI-Rechner) entgegen,
// prüft den Turnstile-Sicherheitscheck und leitet valide Daten an das
// Google-Sheet (via Apps-Script-Webhook) weiter. Secrets (APPS_SCRIPT_URL,
// TURNSTILE_SECRET_KEY) kommen ausschliesslich aus Cloudflare-Umgebungsvariablen,
// tauchen nirgendwo im öffentlichen Frontend-Code auf.

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json();

    // 0. Honeypot: unsichtbares "website"-Feld, das nur Bots ausfüllen.
    // Bei Treffer wird ein Fake-Erfolg zurückgegeben (damit Bots nichts
    // merken), aber NICHTS gespeichert/weitergeleitet.
    if (data.website) {
      return jsonResponse({ success: true });
    }

    // 1. Turnstile-Token serverseitig verifizieren - TEMPORÄR OPTIONAL.
    // Cloudflares Challenge-Plattform liefert aktuell reproduzierbar HTTP 400
    // beim Laden des Widgets (Fehler 400020, browser-/geräteunabhängig,
    // auch mit frisch angelegtem Widget) - wird bei Cloudflare Support
    // gemeldet. Bis das geklärt ist, blockiert ein fehlendes Token die
    // Einreichung nicht mehr; der Honeypot oben ist die primäre Spam-Bremse.
    // Falls doch ein Token mitkommt, wird es weiterhin echt geprüft.
    const token = data.turnstileToken;
    if (token) {
      const ip = request.headers.get("CF-Connecting-IP") || "";

      const turnstileRes = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            secret: env.TURNSTILE_SECRET_KEY,
            response: token,
            remoteip: ip,
          }),
        }
      );

      const turnstileResult = await turnstileRes.json();

      if (!turnstileResult.success) {
        return jsonResponse({ success: false, error: "Sicherheitsprüfung fehlgeschlagen" }, 403);
      }
    }

    // 2. Tool-spezifische Pflichtfeld-Validierung
    const tool = data.tool;

    if (tool === "geo-check") {
      if (!data.firmenname || !data.email || data.consent !== true) {
        return jsonResponse({ success: false, error: "Pflichtfelder fehlen" }, 400);
      }
    } else if (tool === "roi-rechner") {
      if (!data.hours || !data.rate) {
        return jsonResponse({ success: false, error: "Eingaben fehlen" }, 400);
      }
      // E-Mail ist beim ROI-Rechner optional - aber wenn angegeben, muss
      // die Einwilligung mitkommen.
      if (data.email && data.consent !== true) {
        return jsonResponse(
          { success: false, error: "Einwilligung fehlt für E-Mail-Versand" },
          400
        );
      }
    } else {
      return jsonResponse({ success: false, error: "Unbekanntes Tool" }, 400);
    }

    // 3. An Google-Sheet-Webhook weiterleiten (Apps Script)
    const payload = { ...data };
    delete payload.turnstileToken;
    delete payload.website;

    try {
      await fetch(env.APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        redirect: "follow",
      });
    } catch (sheetErr) {
      // Bekannte Eigenart: Google Apps Script liefert bei serverseitigen
      // (nicht-Browser-)Aufrufen manchmal eine nicht sauber lesbare
      // Zwischenantwort, auch wenn der Eintrag im Sheet erfolgreich
      // geschrieben wurde (verifiziert). Wird daher nicht als harter
      // Fehler an den Nutzer durchgereicht, nur geloggt.
      console.error("Apps Script Weiterleitung fehlgeschlagen:", sheetErr);
    }

    return jsonResponse({ success: true });
  } catch (err) {
    console.error("submit.js Fehler:", err);
    return jsonResponse({ success: false, error: "Serverfehler" }, 500);
  }
}

function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
