import * as migration_20261023_094124_add_blob_storage_fields from './20261023_094124_add_blob_storage_fields';

export const migrations = [
  {
    up: migration_20261023_094124_add_blob_storage_fields.up,
    down: migration_20261023_094124_add_blob_storage_fields.down,
    name: '20261023_094124_add_blob_storage_fields'
  },
];
