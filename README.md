# MKMI Québec — site web

Site de MKMI Québec, construit avec **Next.js (App Router)**, **Tailwind CSS** et **Payload CMS**
intégré (administration sur `/admin`), sur **PostgreSQL** (Supabase en production).

## Démarrer en local

```bash
pnpm install
cp .env.example .env          # renseigner DATABASE_URL et PAYLOAD_SECRET
pnpm dev                      # http://localhost:3000 — admin : http://localhost:3000/admin
```

En développement, le schéma de la base est synchronisé automatiquement. Pour avoir du contenu
de démonstration (repris de la maquette) et un compte administrateur :

```bash
SEED_ADMIN_EMAIL=vous@exemple.com SEED_ADMIN_PASSWORD='mot-de-passe' pnpm seed
```

Le contenu de démonstration ne doit **pas** être utilisé en production.

## Administration (CMS)

- **Tableau de bord** : statistiques (vues sur 7/30 jours, pages les plus vues, demandes de prière,
  visites planifiées, inscriptions, abonnés, événements, messages). Les vues sont comptées de façon
  anonyme : pas de cookie, pas d’adresse IP (Loi 25).
- **Contenu** : page d’accueil (tous les textes et photos), événements, messages, ministères,
  missions, médias.
- **Communauté** : témoignages, demandes de prière, visites planifiées, inscriptions, infolettre.
- **Paramètres** : informations de l’église (horaires, adresse, contact, réseaux) et utilisateurs.

Rôles : *Administrateur* (tout), *Éditeur* (contenus publics), *Équipe pastorale*
(demandes de prière et visites). Les demandes de prière ne sont jamais publiques.

## Informations à confirmer

Conformément au cahier des charges, aucune information officielle n’est inventée. L’adresse
(4635, 1re Avenue, local 20, G1H 2T1), le téléphone et la description viennent de la fiche Google
de MKMI Québec. Restent en placeholders : jour et heure du culte, courriel, réseaux sociaux,
logo officiel, photos, zones de mission. Tout se modifie
dans l’administration, sans toucher au code.

## Production

- Base : Supabase (PostgreSQL). Les migrations (`src/migrations`) s’appliquent au démarrage ;
  après une modification du modèle : `pnpm payload migrate:create`.
- Hébergement : Vercel. Variables : `DATABASE_URL`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL`.
- Les médias sont stockés localement par défaut ; sur Vercel, il faudra brancher un stockage
  (Supabase Storage / S3 via `@payloadcms/storage-s3`).

## Scripts

`pnpm dev` · `pnpm build` · `pnpm lint` · `pnpm typecheck` · `pnpm seed` · `pnpm migrate` · `pnpm test`
