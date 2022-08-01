export interface Storage {
  type: StorageType;
  value?: any;
}

export enum StorageType {
  Users = 'USERS',
  TableWidth = 'TABLE_WIDTH',
}
