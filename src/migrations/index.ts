import * as migration_20260924_062231_initial from './20260924_062231_initial';
import * as migration_20260924_074735_settings_coordonnees from './20260924_074735_settings_coordonnees';
import * as migration_20260929_030944_pages_interieures from './20260929_030944_pages_interieures';
import * as migration_20260929_041733_evenements from './20260929_041733_evenements';
import * as migration_20260929_043837_page_don from './20260929_043837_page_don';

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
    name: '20260929_043837_page_don'
  },
];
