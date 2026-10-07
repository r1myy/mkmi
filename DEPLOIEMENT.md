# Mettre le site en ligne sur mkmi.pixora.ca

Le site tourne sur **Hostinger** (application Node.js reliée à GitHub). La base de données et les
fichiers (photos, documents) sont chez **Supabase**, car le site utilise PostgreSQL et Hostinger
ne fournit que MySQL. Supabase est gratuit pour un site de cette taille.

Ne jamais écrire un mot de passe, une clé ou le `PAYLOAD_SECRET` dans un chat, un courriel ou sur GitHub.

## 1. Supabase (base + fichiers)

1. Sur [supabase.com](https://supabase.com), créer un projet `mkmi-quebec`, région **Canada (Central)**.
   Noter le mot de passe de la base dans votre gestionnaire de mots de passe.
2. **Connect** (en haut) › **Session pooler** : copier l’adresse `postgresql://postgres.xxxx:[YOUR-PASSWORD]@aws-0-ca-central-1.pooler.supabase.com:5432/postgres`.
   Remplacer `[YOUR-PASSWORD]` par le mot de passe et ajouter à la fin `?uselibpqcompat=true&sslmode=require`.
   C’est la valeur de `DATABASE_URL`. (La « Direct connection » ne marche pas depuis Hostinger : elle exige IPv6.)
3. **Storage** › **New bucket** : nom `mkmi-fichiers`, **privé** (ne pas cocher « Public »).
4. **Storage** › **S3 Configuration** (ou Project Settings › Storage) : activer la connexion S3, noter
   l’**Endpoint** et la **Region**, puis **New access key** : noter l’Access key ID et la Secret access key.

## 2. Hostinger (le site)

1. hPanel › **Sites web** › **Ajouter un site web** › **Application web Node.js** › **Importer un dépôt Git**.
   Autoriser l’application GitHub de Hostinger sur le dépôt `r1myy/mkmi`.
2. Réglages de l’application :
   - Branche : `claude/site-mkmi-6nrnxj` (ou `main` une fois la branche fusionnée)
   - Framework : **Next.js** · Node.js : **22**
   - Commande de build : `build` · Dossier de sortie : `.next` · Démarrage : automatique (`next start`)
3. **Variables d’environnement** (voir `.env.production.example`) :

   | Nom | Valeur |
   | --- | --- |
   | `DATABASE_URL` | l’adresse de l’étape 1.2 |
   | `PAYLOAD_SECRET` | un secret neuf : dans le Terminal du Mac, `openssl rand -hex 32` |
   | `NEXT_PUBLIC_SITE_URL` | `https://mkmi.pixora.ca` |
   | `S3_BUCKET` | `mkmi-fichiers` |
   | `S3_ENDPOINT` | l’endpoint de l’étape 1.4 |
   | `S3_REGION` | la région de l’étape 1.4 (ex. `ca-central-1`) |
   | `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` | la clé de l’étape 1.4 |

4. **Domaine** : choisir `mkmi.pixora.ca`. Si `pixora.ca` est géré par Hostinger, le sous-domaine
   se crée tout seul ; sinon, ajouter chez le fournisseur du domaine l’enregistrement DNS que Hostinger
   indique. Activer le certificat SSL (gratuit) dans hPanel.
5. Lancer le déploiement. Au premier démarrage, le site crée lui-même les tables dans Supabase.
   Chaque `git push` sur la branche redéploie le site automatiquement.

## 3. Transférer le contenu du Mac vers la production

Les textes, photos et le compte administrateur sont dans la base locale du Mac. Pour les copier
une fois en ligne, dans le Terminal :

```bash
cd ~/Desktop/CLAUDE/MKMI
git pull                       # récupère ce script
npx pnpm@10 install
cp .env.production.example .env.production.local
open -e .env.production.local  # coller les mêmes valeurs que dans Hostinger, puis enregistrer
node scripts/transfert-production.mjs
```

La base locale doit être démarrée (la même que pour voir le site sur http://localhost:3000).
Le script demande confirmation, puis : exporte la base locale, crée les tables en production,
y copie le contenu (il **remplace** ce qui s’y trouve) et envoie les dossiers `media/` et `documents/`
dans Supabase Storage. Ensuite, se connecter sur https://mkmi.pixora.ca/admin avec le compte habituel.

À faire une seule fois : après le transfert, on modifie le contenu directement en ligne. Relancer le
script effacerait les changements faits en ligne.

## En cas de problème

- **Le build échoue faute de mémoire** : dans `package.json`, baisser `--max-old-space-size=8000` à `4096`.
- **« self-signed certificate » / erreur SSL** : vérifier la fin de `DATABASE_URL`
  (`?uselibpqcompat=true&sslmode=require`).
- **Photos absentes en ligne** : vérifier les variables `S3_…` (Hostinger et `.env.production.local`)
  et que les fichiers sont bien dans le bucket `mkmi-fichiers`, sous `media/`.
- Le site se met en veille sans visite et redémarre à la première visite (quelques secondes).
