/*
  LunaVision Cookie-Consent-Konfiguration
  Bibliothek: CookieConsent v3.1.0 (orestbida/cookieconsent, MIT-Lizenz, selbst gehostet)
  Blockiert GTM/GA4 technisch, bis die Kategorie "analytics" aktiv zugestimmt wurde.
  Skripte mit type="text/plain" data-category="analytics" werden von der Bibliothek
  automatisch ausgeführt, sobald Zustimmung erteilt wird.
*/
(function () {
  var lang = document.documentElement.lang === 'en' ? 'en' : 'de';

  CookieConsent.run({
    guiOptions: {
      consentModal: {
        layout: 'box',
        position: 'bottom right',
        equalWeightButtons: true,
        flipButtons: false
      },
      preferencesModal: {
        layout: 'box',
        equalWeightButtons: true,
        flipButtons: false
      }
    },
    categories: {
      necessary: {
        readOnly: true,
        enabled: true
      },
      analytics: {
        autoClear: {
          cookies: [
            { name: /^_ga/ },
            { name: /^_gid/ }
          ]
        }
      }
    },
    language: {
      default: lang,
      translations: {
        de: {
          consentModal: {
            title: 'Wir verwenden Cookies',
            description:
              'Notwendige Cookies sorgen für den technischen Betrieb dieser Website. Mit deiner Einwilligung nutzen wir zusätzlich Google Analytics, um zu verstehen wie die Seite genutzt wird.',
            acceptAllBtn: 'Alle akzeptieren',
            acceptNecessaryBtn: 'Nur notwendige',
            showPreferencesBtn: 'Einstellungen',
            footer:
              '<a href="/datenschutz.html">Datenschutzerklärung</a>'
          },
          preferencesModal: {
            title: 'Cookie-Einstellungen',
            acceptAllBtn: 'Alle akzeptieren',
            acceptNecessaryBtn: 'Nur notwendige',
            savePreferencesBtn: 'Auswahl speichern',
            closeIconLabel: 'Schließen',
            sections: [
              {
                title: 'Notwendig',
                description:
                  'Diese Cookies sind für den Betrieb der Website erforderlich und können nicht deaktiviert werden.',
                linkedCategory: 'necessary'
              },
              {
                title: 'Analyse (Google Analytics)',
                description:
                  'Hilft uns zu verstehen, wie Besucher die Website nutzen. Dabei werden Daten an Google LLC (USA) übermittelt. Nur mit deiner Einwilligung aktiv.',
                linkedCategory: 'analytics',
                cookieTable: {
                  headers: { name: 'Cookie', domain: 'Anbieter', desc: 'Zweck' },
                  body: [
                    { name: '_ga', domain: 'Google LLC', desc: 'Unterscheidet Website-Besucher, Speicherdauer ca. 2 Jahre.' },
                    { name: '_ga_*', domain: 'Google LLC', desc: 'Speichert Sitzungsstatus für Google Analytics 4, Speicherdauer ca. 2 Jahre.' }
                  ]
                }
              }
            ]
          }
        },
        en: {
          consentModal: {
            title: 'We use cookies',
            description:
              'Necessary cookies keep this website running. With your consent, we also use Google Analytics to understand how the site is used.',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Necessary only',
            showPreferencesBtn: 'Preferences',
            footer:
              '<a href="/datenschutz.html">Privacy Policy</a>'
          },
          preferencesModal: {
            title: 'Cookie Preferences',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Necessary only',
            savePreferencesBtn: 'Save preferences',
            closeIconLabel: 'Close',
            sections: [
              {
                title: 'Necessary',
                description:
                  'Required for the website to function and cannot be disabled.',
                linkedCategory: 'necessary'
              },
              {
                title: 'Analytics (Google Analytics)',
                description:
                  'Helps us understand how visitors use the website. Data is transmitted to Google LLC (USA). Only active with your consent.',
                linkedCategory: 'analytics',
                cookieTable: {
                  headers: { name: 'Cookie', domain: 'Provider', desc: 'Purpose' },
                  body: [
                    { name: '_ga', domain: 'Google LLC', desc: 'Distinguishes website visitors, retention approx. 2 years.' },
                    { name: '_ga_*', domain: 'Google LLC', desc: 'Persists session state for Google Analytics 4, retention approx. 2 years.' }
                  ]
                }
              }
            ]
          }
        }
      }
    }
  });
})();
