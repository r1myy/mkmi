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

### Modifier les pages (éditeur visuel)

- **Pages du site** (menu de gauche) : une fiche par page (Accueil, Église, Découvrir…). Chaque onglet
  est une section de la page, dans l’ordre d’affichage ; chaque champ est un texte, un bouton ou une photo.
- **Aperçu en direct** à droite des champs : il se met à jour pendant la saisie (brouillon enregistré
  automatiquement). Le public ne voit rien avant « Publier les modifications ».
- **Mode édition** : bouton « Ouvrir le site en mode édition » sur le tableau de bord. Sur le site,
  survoler une section l’encadre et « Modifier » ouvre exactement cet onglet dans l’administration.
- Dans les titres, les mots entre `*astérisques*` s’affichent en or.


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

En ligne sur **https://mkmi.pixora.ca** : Hostinger (application Node.js reliée à GitHub) +
Supabase (base PostgreSQL et stockage des fichiers). Marche à suivre complète : [DEPLOIEMENT.md](DEPLOIEMENT.md).

- Les migrations (`src/migrations`) s’appliquent au démarrage ; après une modification du modèle :
  `pnpm payload migrate:create`.
- Variables : voir `.env.production.example`.
- Premier transfert du contenu local vers la production : `node scripts/transfert-production.mjs`.

## Sauvegarde et transfert du contenu

- `node scripts/export-data.mjs sauvegarde.json` : exporte tout le contenu de la base (lit `DATABASE_URL`).
- `node scripts/import-data.mjs sauvegarde.json` : le restaure dans une base dont le schéma existe
  (`npx pnpm@10 payload migrate` d’abord). Copier aussi le dossier `media/` (photos).

## Scripts

`pnpm dev` · `pnpm build` · `pnpm lint` · `pnpm typecheck` · `pnpm seed` · `pnpm migrate` · `pnpm test`
