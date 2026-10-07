import * as migration_20260924_062231_initial from './20260924_062231_initial'
import * as migration_20260924_074735_settings_coordonnees from './20260924_074735_settings_coordonnees'
import * as migration_20260929_030944_pages_interieures from './20260929_030944_pages_interieures'
import * as migration_20260929_041733_evenements from './20260929_041733_evenements'
import * as migration_20260929_043837_page_don from './20260929_043837_page_don'
import * as migration_20260929_053234_editeur_pages from './20260929_053234_editeur_pages'
import * as migration_20260929_071211_inscriptions_statut from './20260929_071211_inscriptions_statut'
import * as migration_20260929_071734_messages_boite from './20260929_071734_messages_boite'
import * as migration_20260929_072427_registre_dons from './20260929_072427_registre_dons'
import * as migration_20260929_073203_missions_suivi from './20260929_073203_missions_suivi'
import * as migration_20260929_073805_medias_documents_liens from './20260929_073805_medias_documents_liens'
import * as migration_20260929_074201_annonces from './20260929_074201_annonces'
import * as migration_20260929_074952_courriels_reseaux from './20260929_074952_courriels_reseaux'
import * as migration_20260929_075314_utilisateurs_statut from './20260929_075314_utilisateurs_statut'
import * as migration_20260929_075739_membres from './20260929_075739_membres'
import * as migration_20260929_115757_messages_predications from './20260929_115757_messages_predications'
import * as migration_20260929_221234_messages_reactions from './20260929_221234_messages_reactions'
import * as migration_20260930_030150_page_visite from './20260930_030150_page_visite'
import * as migration_20260930_041041_pages_temoignages_foi from './20260930_041041_pages_temoignages_foi'
import * as migration_20261007_073206_stockage_en_ligne from './20261007_073206_stockage_en_ligne'

export const migrations = [
  {
    up: migration_20260924_062231_initial.up,
    down: migration_20260924_062231_initial.down,
    name: '20260924_062231_initial',
  },
  {
    up: migration_20260924_074735_settings_coordonnees.up,
    down: migration_20260924_074735_settings_coordonnees.down,
    name: '20260924_074735_settings_coordonnees',
  },
  {
    up: migration_20260929_030944_pages_interieures.up,
    down: migration_20260929_030944_pages_interieures.down,
    name: '20260929_030944_pages_interieures',
  },
  {
    up: migration_20260929_041733_evenements.up,
    down: migration_20260929_041733_evenements.down,
    name: '20260929_041733_evenements',
  },
  {
    up: migration_20260929_043837_page_don.up,
    down: migration_20260929_043837_page_don.down,
    name: '20260929_043837_page_don',
  },
  {
    up: migration_20260929_053234_editeur_pages.up,
    down: migration_20260929_053234_editeur_pages.down,
    name: '20260929_053234_editeur_pages',
  },
  {
    up: migration_20260929_071211_inscriptions_statut.up,
    down: migration_20260929_071211_inscriptions_statut.down,
    name: '20260929_071211_inscriptions_statut',
  },
  {
    up: migration_20260929_071734_messages_boite.up,
    down: migration_20260929_071734_messages_boite.down,
    name: '20260929_071734_messages_boite',
  },
  {
    up: migration_20260929_072427_registre_dons.up,
    down: migration_20260929_072427_registre_dons.down,
    name: '20260929_072427_registre_dons',
  },
  {
    up: migration_20260929_073203_missions_suivi.up,
    down: migration_20260929_073203_missions_suivi.down,
    name: '20260929_073203_missions_suivi',
  },
  {
    up: migration_20260929_073805_medias_documents_liens.up,
    down: migration_20260929_073805_medias_documents_liens.down,
    name: '20260929_073805_medias_documents_liens',
  },
  {
    up: migration_20260929_074201_annonces.up,
    down: migration_20260929_074201_annonces.down,
    name: '20260929_074201_annonces',
  },
  {
    up: migration_20260929_074952_courriels_reseaux.up,
    down: migration_20260929_074952_courriels_reseaux.down,
    name: '20260929_074952_courriels_reseaux',
  },
  {
    up: migration_20260929_075314_utilisateurs_statut.up,
    down: migration_20260929_075314_utilisateurs_statut.down,
    name: '20260929_075314_utilisateurs_statut',
  },
  {
    up: migration_20260929_075739_membres.up,
    down: migration_20260929_075739_membres.down,
    name: '20260929_075739_membres',
  },
  {
    up: migration_20260929_115757_messages_predications.up,
    down: migration_20260929_115757_messages_predications.down,
    name: '20260929_115757_messages_predications',
  },
  {
    up: migration_20260929_221234_messages_reactions.up,
    down: migration_20260929_221234_messages_reactions.down,
    name: '20260929_221234_messages_reactions',
  },
  {
    up: migration_20260930_030150_page_visite.up,
    down: migration_20260930_030150_page_visite.down,
    name: '20260930_030150_page_visite',
  },
  {
    up: migration_20260930_041041_pages_temoignages_foi.up,
    down: migration_20260930_041041_pages_temoignages_foi.down,
    name: '20260930_041041_pages_temoignages_foi',
  },
  {
    up: migration_20261007_073206_stockage_en_ligne.up,
    down: migration_20261007_073206_stockage_en_ligne.down,
    name: '20261007_073206_stockage_en_ligne',
  },
]
