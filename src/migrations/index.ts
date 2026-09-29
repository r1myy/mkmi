import * as migration_20260924_062231_initial from './20260924_062231_initial';
import * as migration_20260924_074735_settings_coordonnees from './20260924_074735_settings_coordonnees';
import * as migration_20260929_030944_pages_interieures from './20260929_030944_pages_interieures';

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
    name: '20260929_030944_pages_interieures'
  },
];
