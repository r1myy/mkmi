import * as migration_20260924_062231_initial from './20260924_062231_initial';
import * as migration_20260924_074735_settings_coordonnees from './20260924_074735_settings_coordonnees';
import * as migration_20260929_030944_pages_interieures from './20260929_030944_pages_interieures';
import * as migration_20260929_041733_evenements from './20260929_041733_evenements';
import * as migration_20260929_043837_page_don from './20260929_043837_page_don';
import * as migration_20260929_053234_editeur_pages from './20260929_053234_editeur_pages';
import * as migration_20260929_071211_inscriptions_statut from './20260929_071211_inscriptions_statut';
import * as migration_20260929_071734_messages_boite from './20260929_071734_messages_boite';
import * as migration_20260929_072427_registre_dons from './20260929_072427_registre_dons';
import * as migration_20260929_073203_missions_suivi from './20260929_073203_missions_suivi';
import * as migration_20260929_073805_medias_documents_liens from './20260929_073805_medias_documents_liens';

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
    name: '20260929_073805_medias_documents_liens'
  },
];
