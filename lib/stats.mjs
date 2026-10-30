// Logique des statistiques, partagée par les deux fonctions (et testable seule).

export const EVENEMENTS = ["view", "open_cart", "add_to_cart", "checkout", "purchase", "color", "waitlist"];
const MAX_SOURCES = 40;

export const nettoie = (v, n = 40) =>
  String(v || "").toLowerCase().normalize("NFD").replace(/[^a-z0-9._-]/g, "").slice(0, n);

// Date et heure à Paris (le jour change à minuit, heure française)
export const jourParis = (d = new Date()) => new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris" }).format(d);
export const heureParis = (d = new Date()) =>
  parseInt(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", hour: "2-digit", hourCycle: "h23" }).format(d), 10) % 24;

export const docVide = () => ({ evenements: {}, sources: {}, campagnes: {}, pays: {}, appareils: {}, heures: Array(24).fill(0) });

// Ajoute un événement au résumé du jour. Ne garde aucune donnée personnelle : que des compteurs.
export function ajoute(doc, { event, source, campaign, mobile, pays }, quand = new Date()) {
  const d = doc || docVide();
  const plus = (obj, cle) => { obj[cle] = (obj[cle] || 0) + 1; };
  let src = nettoie(source) || "direct";
  if (!d.sources[src] && Object.keys(d.sources).length >= MAX_SOURCES) src = "autre";
  plus(d.evenements, event);
  d.sources[src] = d.sources[src] || {};
  plus(d.sources[src], event);
  const camp = nettoie(campaign);
  if (camp) {
    if (d.campagnes[camp] || Object.keys(d.campagnes).length < MAX_SOURCES) {
      d.campagnes[camp] = d.campagnes[camp] || {};
      plus(d.campagnes[camp], event);
    }
  }
  if (event === "view") {
    plus(d.pays, (nettoie(pays, 2) || "??").toUpperCase());
    plus(d.appareils, mobile ? "mobile" : "ordinateur");
    if (!Array.isArray(d.heures) || d.heures.length !== 24) d.heures = Array(24).fill(0);
    d.heures[heureParis(quand)] += 1;
  }
  return d;
}

// Liste des N derniers jours (heure de Paris), du plus ancien au plus récent
export function derniersJours(n, aujourdhui = jourParis()) {
  const [y, m, j] = aujourdhui.split("-").map(Number);
  return Array.from({ length: n }, (_, i) => new Date(Date.UTC(y, m - 1, j - (n - 1 - i))).toISOString().slice(0, 10));
}
