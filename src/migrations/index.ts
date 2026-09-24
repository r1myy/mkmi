import * as migration_20260924_062231_initial from './20260924_062231_initial';

export const migrations = [
  {
    up: migration_20260924_062231_initial.up,
    down: migration_20260924_062231_initial.down,
    name: '20260924_062231_initial'
  },
];
