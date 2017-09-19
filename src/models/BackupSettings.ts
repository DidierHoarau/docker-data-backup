export class BackupSettings {
  public rules: IRule[];
  public remoteStorage: IRemoteStorage;
  public backupCheckIntervalMs?: number;
}

export interface IRule {
  service: string;
  command: string;
  maxAgeMs?: number;
  hourOfDay?: number;
  daysToKeep?: number;
}

export interface IRemoteStorage {
  address: string;
  user: string;
  port: number;
  folder: string;
}
