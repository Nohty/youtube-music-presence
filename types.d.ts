declare const API: APIType;

interface APIType {
  getSettings(): Promise<SettingsType>;
  setSettings(settings: SettingsType): Promise<void>;
}

type SettingsType = {
  port: number;
  enabled: boolean;
};

type MusicInfo = {
  title: string | null;
  artist: string | null;
  album: string | null;
  year: string | null;
  image: string | null;
  url: string | null;
  playing: boolean;
};