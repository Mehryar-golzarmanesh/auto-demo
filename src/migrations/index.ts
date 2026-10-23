import * as migration_20261023_104922_initial from './20261023_104922_initial';

export const migrations = [
  {
    up: migration_20261023_104922_initial.up,
    down: migration_20261023_104922_initial.down,
    name: '20261023_104922_initial'
  },
];
