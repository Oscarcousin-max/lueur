// Reçoit les événements de la boutique (visite, panier, paiement…) et les compte par jour.
import { getStore } from "@netlify/blobs";
import { EVENEMENTS, ajoute, jourParis } from "../../lib/stats.mjs";

export default async (req, context) => {
  if (req.method !== "POST") return new Response("Méthode non autorisée", { status: 405 });
  const ua = req.headers.get("user-agent") || "";
  if (/bot|crawl|spider|preview|facebookexternalhit|headless|lighthouse/i.test(ua)) return new Response(null, { status: 204 });

  let corps;
  try { corps = await req.json(); } catch { return new Response("Requête invalide", { status: 400 }); }
  const event = String(corps?.event || "");
  if (!EVENEMENTS.includes(event)) return new Response("Événement inconnu", { status: 400 });

  const maintenant = new Date();
  const store = getStore({ name: "stats-lueur", consistency: "strong" });
  const cle = `jour/${jourParis(maintenant)}`;
  const doc = await store.get(cle, { type: "json" });
  const maj = ajoute(doc, {
    event,
    source: corps.source,
    campaign: corps.campaign,
    mobile: !!corps.mobile,
    pays: context?.geo?.country?.code,
  }, maintenant);
  await store.setJSON(cle, maj);
  return new Response(null, { status: 204 });
};

export const config = { path: "/api/track" };
