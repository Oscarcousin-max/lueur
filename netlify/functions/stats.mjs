// Renvoie les compteurs des derniers jours au tableau de bord (protégé par le code STATS_CODE).
import { getStore } from "@netlify/blobs";
import { derniersJours } from "../../lib/stats.mjs";

export default async (req) => {
  const attendu = process.env.STATS_CODE || "";
  if (!attendu) {
    return Response.json({ erreur: "Le code des statistiques n'est pas encore réglé dans Netlify (variable STATS_CODE)." }, { status: 503 });
  }
  if ((req.headers.get("x-code-stats") || "") !== attendu) {
    return Response.json({ erreur: "Code incorrect." }, { status: 401 });
  }
  const url = new URL(req.url);
  const n = Math.min(Math.max(parseInt(url.searchParams.get("jours") || "90", 10) || 90, 1), 90);
  const store = getStore({ name: "stats-lueur", consistency: "strong" });
  const jours = derniersJours(n);
  const docs = await Promise.all(jours.map((j) => store.get(`jour/${j}`, { type: "json" }).catch(() => null)));
  return Response.json(
    { genere: new Date().toISOString(), jours: jours.map((jour, i) => ({ jour, ...(docs[i] || {}) })) },
    { headers: { "Cache-Control": "no-store" } },
  );
};

export const config = { path: "/api/stats" };
