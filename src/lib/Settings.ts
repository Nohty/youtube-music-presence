import { app } from "electron";
import { readFile, writeFile } from "fs/promises";

export class Settings {
  private static readonly path = `${app.getPath("userData")}/settings.json`;

  private static createDefault(): SettingsType {
    return { port: 3002, enabled: true };
  }

  private static async read(): Promise<SettingsType | null> {
    try {
      const data = await readFile(this.path);
      return JSON.parse(data.toString());
    } catch (e) {
      return null;
    }
  }

  public static async getSettings(): Promise<SettingsType> {
    const settings = await this.read();
    if (settings === null) return Settings.createDefault();
    return settings;
  }

  public static async setSettings(settings: SettingsType): Promise<void> {
    await writeFile(this.path, JSON.stringify(settings));
  }
}
