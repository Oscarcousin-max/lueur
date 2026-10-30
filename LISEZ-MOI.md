# Boutique Lueur

La boutique (dossier `site/`) et ses statistiques internes (dossier `netlify/functions/`).
Tout est gratuit : Netlify héberge le site, compte les visites et garde la liste d'attente.

## Mettre en ligne (une seule fois, 5 minutes)

1. Sur **app.netlify.com** : **Add new site → Import an existing project → GitHub** → choisis le dépôt **lueur**.
2. Netlify lit tout seul les réglages (`netlify.toml`). Clique **Deploy**.
3. **Site configuration → Environment variables → Add a variable** :
   - Nom : `STATS_CODE`
   - Valeur : ton code secret pour voir les statistiques
   - Puis **Deploys → Trigger deploy** pour qu'il soit pris en compte.
4. **Forms → Enable form detection**, puis relance un déploiement : la liste d'attente et le formulaire de contact marchent.
5. (Plus tard) **Domain management** pour un vrai nom de domaine.

Ensuite, chaque modification envoyée sur GitHub met la boutique à jour toute seule.

## Les pages

| Adresse | Ce que c'est |
| --- | --- |
| `/` | La page de vente |
| `/stats.html` | Ton tableau de bord (visites, sources, paniers, achats, liste d'attente) |
| `/cgv.html`, `/mentions-legales.html`, `/confidentialite.html`, `/livraison-retours.html` | Pages légales |
| `/contact.html` | Formulaire de contact (messages dans Netlify → Forms) |
| `/merci.html` | Page après le paiement Stripe |

## Les liens à mettre dans tes bios

- TikTok : `https://TON-SITE/?utm_source=tiktok`
- Instagram : `https://TON-SITE/?utm_source=instagram`
- Pour une vidéo précise : `https://TON-SITE/?utm_source=tiktok&utm_campaign=video-1`

## Ouvrir les ventes (quand la micro-entreprise et Stripe sont prêts)

Dans `site/index.html`, partie **RÉGLAGES DE LA BOUTIQUE** :
- colle les 2 liens Stripe (89 € et 79 €) ;
- règle `debutOffre` à **30 jours après l'ouverture des ventes** (règle du prix barré) ;
- vérifie `delai` et `dateLimiteNoel`.

Tant que les liens ne sont pas collés : bandeau « Boutique en préparation », et le panier propose la **liste d'attente** au lieu du paiement.

## Où voir quoi

- **Visites, sources, paniers** : `/stats.html`
- **E-mails de la liste d'attente** : Netlify → Forms → liste-attente
- **Ventes et argent** : tableau de bord Stripe (le chiffre officiel)

## Statistiques : ce qui est compté

Uniquement des compteurs anonymes par jour : visites, provenance (TikTok, Instagram…), pays, téléphone ou ordinateur, heure, ajouts au panier, clics « Payer », achats (retour sur la page merci), inscriptions. Aucun cookie, aucune adresse IP gardée.
